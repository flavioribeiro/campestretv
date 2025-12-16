#!/usr/bin/env python3
"""
YouTube Live Stream Creator Script
===================================
This script creates three scheduled YouTube live streams for tennis courts.
Designed to be run via crontab.

Prerequisites:
1. Install dependencies: pip install google-auth google-auth-oauthlib google-api-python-client
2. Create OAuth 2.0 credentials in Google Cloud Console
3. Download client_secrets.json to the scripts directory
4. Run once manually to complete OAuth flow and save credentials

Crontab example (run daily at 6 AM):
0 6 * * * /usr/bin/python3 /path/to/create_youtube_streams.py
"""

import os
import json
import pickle
from datetime import datetime
from pathlib import Path

from babel.dates import format_date
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# YouTube API scopes required for live streaming
SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]

# Script directory for storing credentials
SCRIPT_DIR = Path(__file__).parent.resolve()
CLIENT_SECRETS_FILE = SCRIPT_DIR / "client_secrets.json"
TOKEN_FILE = SCRIPT_DIR / "token.pickle"

# Court configurations
COURTS = [
    {"id": 5, "name": "Quadra 5"},
    {"id": 6, "name": "Quadra 6"},
    {"id": 8, "name": "Quadra 8"},
]


def get_authenticated_service():
    """
    Authenticate with YouTube API using OAuth 2.0.
    On first run, opens browser for authorization.
    Subsequently uses saved credentials.
    """
    credentials = None

    # Load existing credentials if available
    if TOKEN_FILE.exists():
        with open(TOKEN_FILE, "rb") as token:
            credentials = pickle.load(token)

    # Refresh or obtain new credentials if needed
    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        else:
            if not CLIENT_SECRETS_FILE.exists():
                raise FileNotFoundError(
                    f"Client secrets file not found: {CLIENT_SECRETS_FILE}\n"
                    "Download it from Google Cloud Console > APIs & Services > Credentials"
                )
            flow = InstalledAppFlow.from_client_secrets_file(
                str(CLIENT_SECRETS_FILE), SCOPES
            )
            credentials = flow.run_local_server(port=0)

        # Save credentials for future runs
        with open(TOKEN_FILE, "wb") as token:
            pickle.dump(credentials, token)

    return build("youtube", "v3", credentials=credentials)


def generate_stream_title(court_name: str) -> str:
    """
    Generate stream title with current day of week, day of month, and court name.
    Example: "Saturday 14 - Quadra 8"
    """
    now = datetime.now()
    day = format_date(now, locale="pt_BR", format="full")
    return f"{court_name} - {day}"


def create_live_broadcast(youtube, title: str, court_name: str) -> dict:
    """
    Create a YouTube live broadcast (the public-facing event).
    
    Settings:
    - Privacy: public
    - Auto-start: enabled (starts when stream ingestion begins)
    - Auto-stop: enabled (stops when stream ingestion ends)
    - Latency: normal
    """
    # Schedule for "now" - the broadcast will go live when ingestion starts
    scheduled_start = datetime.utcnow().isoformat() + "Z"

    request = youtube.liveBroadcasts().insert(
        part="snippet,status,contentDetails",
        body={
            "snippet": {
                "title": title,
                "description": f"Stream ao vivo da quadra {court_name} do Campestre TV",
                "scheduledStartTime": scheduled_start,
            },
            "status": {
                "privacyStatus": "public",
                "selfDeclaredMadeForKids": False,
            },
            "contentDetails": {
                "enableAutoStart": True,  # Start when stream is ingested
                "enableAutoStop": True,   # Stop when stream ends
                "latencyPreference": "low",
                "enableDvr": True,
                "enableEmbed": True,
                "recordFromStart": True,
            },
        },
    )

    response = request.execute()
    print(f"✓ Created broadcast: {title}")
    print(f"  Broadcast ID: {response['id']}")
    return response


def create_live_stream(youtube, title: str) -> dict:
    """
    Create a YouTube live stream (the ingest endpoint).
    Each stream gets a unique stream key for ingestion.
    """
    request = youtube.liveStreams().insert(
        part="snippet,cdn,contentDetails",
        body={
            "snippet": {
                "title": f"Stream - {title}",
                "description": f"Ingest stream for {title}",
            },
            "cdn": {
                "frameRate": "variable",
                "ingestionType": "rtmp",
                "resolution": "variable",
            },
            "contentDetails": {
                "isReusable": False,  # Create unique stream for each broadcast
            },
        },
    )

    response = request.execute()
    print(f"✓ Created stream for: {title}")
    print(f"  Stream ID: {response['id']}")
    
    # Extract stream key info
    ingestion_info = response.get("cdn", {}).get("ingestionInfo", {})
    print(f"  Ingest URL: {ingestion_info.get('ingestionAddress', 'N/A')}")
    print(f"  Stream Key: {ingestion_info.get('streamName', 'N/A')}")
    
    return response


def bind_broadcast_to_stream(youtube, broadcast_id: str, stream_id: str) -> dict:
    """
    Bind a broadcast to a stream, linking the public event to the ingest endpoint.
    """
    request = youtube.liveBroadcasts().bind(
        part="id,contentDetails",
        id=broadcast_id,
        streamId=stream_id,
    )

    response = request.execute()
    print(f"✓ Bound broadcast {broadcast_id} to stream {stream_id}")
    return response


def create_court_stream(youtube, court: dict) -> dict:
    """
    Create a complete live stream setup for a single court.
    Returns stream details including the stream key.
    """
    title = generate_stream_title(court["name"])
    
    print(f"\n{'='*50}")
    print(f"Setting up stream: {title}")
    print(f"{'='*50}")

    # Create the broadcast (public event)
    broadcast = create_live_broadcast(youtube, title, court["name"])
    
    # Create the stream (ingest endpoint)
    stream = create_live_stream(youtube, title)
    
    # Bind them together
    bind_broadcast_to_stream(youtube, broadcast["id"], stream["id"])

    # Extract relevant info
    ingestion_info = stream.get("cdn", {}).get("ingestionInfo", {})
    
    return {
        "court_id": court["id"],
        "court_name": court["name"],
        "title": title,
        "broadcast_id": broadcast["id"],
        "stream_id": stream["id"],
        "video_id": broadcast["id"],  # The broadcast ID is also the video ID
        "ingest_url": ingestion_info.get("ingestionAddress"),
        "stream_key": ingestion_info.get("streamName"),
        "watch_url": f"https://youtube.com/watch?v={broadcast['id']}",
    }


def save_stream_info(streams: list):
    """
    Save stream information to a JSON file for reference.
    This updates the frontend with new video IDs in the expected format.
    """
    output_file = SCRIPT_DIR.parent / "src" / "assets" / "data" / "live.json"
    
    # Format output to match existing live.json structure
    output_data = [
        {
            "id": stream["court_id"],
            "title": stream["court_name"],
            "type": "youtube",
            "videoId": stream["broadcast_id"],
        }
        for stream in streams
    ]

    with open(output_file, "w") as f:
        json.dump(output_data, f, indent=2)

    print(f"\n✓ Stream info saved to: {output_file}")
    
    # Also save detailed stream info for debugging/reference
    detailed_file = SCRIPT_DIR / "stream_details.json"
    detailed_data = {
        "generated_at": datetime.now().isoformat(),
        "streams": streams,
    }
    with open(detailed_file, "w") as f:
        json.dump(detailed_data, f, indent=2)
    print(f"✓ Detailed stream info saved to: {detailed_file}")


def construct_go2rtc_yaml(streams: list):
    """
    Construct a go2rtc YAML configuration for the streams.
    """
    output_file = SCRIPT_DIR / "go2rtc.yaml"
    with open(output_file, "w") as f:
        f.write("streams:\n")
        for stream in streams:
            ingest_url = os.environ["QUADRA" + str(stream['court_id'])]
            f.write(f"  quadra{stream['court_id']}: \"{ingest_url}\"\n")

        f.write("\npublish:\n")
        for stream in streams:
            f.write(f"  quadra{stream['court_id']}: \"{stream['ingest_url']}/{stream['stream_key']}\"\n")

        f.write("\nlog:\n")
        f.write(f"  output: \"file\"\n")
        f.write(f"  level: \"trace\"\n")
        f.write(f"  format: \"json\"\n")

    print(f"✓ Go2rtc YAML configuration saved to: {output_file}")

def main():
    """
    Main entry point for the script.
    Creates live streams for all configured courts.
    """
    print("=" * 60)
    print("YouTube Live Stream Creator")
    print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # Authenticate with YouTube API
    print("\nAuthenticating with YouTube API...")
    youtube = get_authenticated_service()
    print("✓ Authentication successful")

    # Create streams for each court
    created_streams = []
    for court in COURTS:
        try:
            stream_info = create_court_stream(youtube, court)
            created_streams.append(stream_info)
        except HttpError as e:
            print(f"✗ Error creating stream for {court['name']}: {e}")
            continue

    # Save stream information
    if created_streams:
        save_stream_info(created_streams)
        construct_go2rtc_yaml(created_streams)

    # Print summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    for stream in created_streams:
        print(f"\n{stream['court_name']}:")
        print(f"  Title: {stream['title']}")
        print(f"  Watch URL: {stream['watch_url']}")
        print(f"  Stream Key: {stream['stream_key']}")

    print(f"\n✓ Successfully created {len(created_streams)}/{len(COURTS)} streams")


    return 0


if __name__ == "__main__":
    exit(main())

