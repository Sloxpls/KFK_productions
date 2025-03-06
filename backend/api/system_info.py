import os
import psutil
from flask import Blueprint, jsonify

system_info_bp = Blueprint('system_info_bp', __name__)

def get_container_memory():
    meminfo = {
        "usage_bytes": None,
        "limit_bytes": None
    }

    usage_path_v2 = "/sys/fs/cgroup/memory.current"
    limit_path_v2 = "/sys/fs/cgroup/memory.max"

    usage_path_v1 = "/sys/fs/cgroup/memory/memory.usage_in_bytes"
    limit_path_v1 = "/sys/fs/cgroup/memory/memory.limit_in_bytes"

    if os.path.isfile(usage_path_v2) and os.path.isfile(limit_path_v2):
        try:
            with open(usage_path_v2, "r") as f:
                usage_str = f.read().strip()
            with open(limit_path_v2, "r") as f:
                limit_str = f.read().strip()

            meminfo["usage_bytes"] = int(usage_str)

            meminfo["limit_bytes"] = None if limit_str == "max" else int(limit_str)
        except Exception as e:
            meminfo = {"error": f"Failed reading cgroup v2 files: {str(e)}"}

    elif os.path.isfile(usage_path_v1) and os.path.isfile(limit_path_v1):
        try:
            with open(usage_path_v1, "r") as f:
                usage_str = f.read().strip()
            with open(limit_path_v1, "r") as f:
                limit_str = f.read().strip()

            meminfo["usage_bytes"] = int(usage_str)
            meminfo["limit_bytes"] = int(limit_str)
        except Exception as e:
            meminfo = {"error": f"Failed reading cgroup v1 files: {str(e)}"}

    else:
        meminfo = {"error": "No cgroup v1 or v2 memory files found. Unsupported system or environment."}

    if "error" not in meminfo:
        usage_mb = meminfo["usage_bytes"] / (1024 ** 2) if meminfo["usage_bytes"] else None
        limit_mb = (meminfo["limit_bytes"] / (1024 ** 2)) if meminfo["limit_bytes"] else None
        meminfo["usage_mb"] = round(usage_mb, 2) if usage_mb else None
        meminfo["limit_mb"] = round(limit_mb, 2) if limit_mb else None

    return meminfo


def get_volume_usage():

    volume_paths = {
        "media_uploads": "/app/media_uploads",
        "db_data": "/app/db_data"
    }

    usage_info = {}
    for label, path in volume_paths.items():
        if not os.path.exists(path):
            usage_info[label] = {"error": f"Path '{path}' does not exist in container."}
            continue

        try:
            disk_info = psutil.disk_usage(path)
            usage_info[label] = {
                "total_gb": round(disk_info.total / (1024 ** 3), 2),
                "used_gb": round(disk_info.used / (1024 ** 3), 2),
                "free_gb": round(disk_info.free / (1024 ** 3), 2),
                "percent_used": disk_info.percent
            }
        except Exception as e:
            usage_info[label] = {"error": str(e)}

    return usage_info


@system_info_bp.route('/system_info', methods=['GET'])
def system_status():
    ram_info = get_container_memory()
    volumes_info = get_volume_usage()

    return jsonify({
        "container_ram": ram_info,
        "volume_usage": volumes_info
    })
