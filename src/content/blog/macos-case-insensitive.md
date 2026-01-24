---
title: Making a Case Sensitive folder on MacOS
date: 2025-03-10
draft: true
---

First we need to figure out which disk to create our new volume on:

Here I'm copying whatever `Nix Store` is using, but really we just need whatever disk `Apple_APFS` is on.
```sh
REFERENCE_CONTAINER=$(diskutil info "Nix Store" 2>/dev/null | grep "Container:" | awk '{print $3}')
```

Now we can create a case-insensitive volume:

```sh
VOLUME_NAME="OsmTest"
diskutil apfs addVolume $REFERENCE_CONTAINER APFSX "$VOLUME_NAME"
```

We'll need the device the volume is mounted at to mount later:

```sh
VOLUME_DEVICE=$(diskutil info "$VOLUME_NAME" | grep "Device Node:" | awk '{print $3}')
```

Next create the folder we want to mount to:

```sh
MOUNT_POINT=~/test
mkdir -p "$MOUNT_POINT"
```

(Why is this a requirement? Not sure)

Now we can mount the folder:

```sh
sudo mount -t apfs $VOLUME_DEVICE "$MOUNT_POINT"
```

We won't have much luck using it unless we set the user & group:

```sh
USER_ID=$(id -u $USER)
GROUP_ID=$(id -g $USER)
sudo chown "$USER_ID:$GROUP_ID" "$MOUNT_POINT"
```

---

NOTE: The mount will disappear on reboot (I think)
      Tbd: fix this with a launchdaemon?
