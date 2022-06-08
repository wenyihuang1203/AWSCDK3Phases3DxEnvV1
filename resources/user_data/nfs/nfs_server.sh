#!/usr/bin/env bash

# Create directory structure for export (assume NFSv4)
mkdir -p /exports/{plat_data,fcs_data}

# Bind mount EBS mounts to NFSv4 file structure
echo "/plat_data /exports/plat_data none rbind 0 0"   >> /etc/fstab
echo "/fcs_data /exports/fcs_data none rbind 0 0"     >> /etc/fstab
mount /exports/plat_data
mount /exports/fcs_data

# Copy exports template file into place
# cp ./exports /etc/exports

# Write updates to exports file
# Setup fsid=0 for export root