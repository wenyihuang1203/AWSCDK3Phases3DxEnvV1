#!/usr/bin/env bash

# Update OS
yum update -y

# Add helpful packages
yum install -y \
    curl \
    iputils \
    nmap-ncat \
    sed \
    tmux \
    unzip \
    xfsprogs \
    zip

# Add DS prereq packages
yum install -y \
    redhat-lsb-core.x86_64 \
    libXt.x86_64 \
    unixODBC.x86_64 \
    mesa-libOSMesa.x86_64 \
    mesa-libglapi.x86_64 \
    xorg-x11-xauth.x86_64 \
    motif.x86_64 \
    bzip2-libs.x86_64 \
    cairo \
    compat-openssl10.x86_64 \
    dejavu-sans-fonts \
    gd.x86_64 \
    glib2.x86_64 \
    libaio.x86_64 \
    libdrm.x86_64 \
    libpng12.x86_64 \
    libstdc++.x86_64 \
    libX11.x86_64 \
    libXau.x86_64 \
    libxcb.x86_64 \
    libXcomposite.x86_64 \
    libXdamage.x86_64 \
    libXext.x86_64 \
    libxml2.x86_64 \
    libXrender.x86_64 \
    libxslt.x86_64 \
    libXxf86vm.x86_64 \
    mesa-libGL.x86_64 \
    openldap.x86_64 \
    openssl-1.1.*.x86_64 \
    pcre.x86_64 \
    pcre-utf16.x86_64 \
    rsync.x86_64 \
    xz-libs.x86_64 \
    zlib.x86_64 \
    glibc-langpack-en.x86_64

# Add Python and PIP - we will need it eventually
yum install -y \
    python2 \
    python3 \
    policycoreutils-python-utils

# Do some package cleanup
yum clean all
