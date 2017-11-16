# Node.js Base Image
FROM node:8

# Install Rust
# https://github.com/rust-lang-nursery/docker-rust/blob/6424dba66086036a0cedde6c86c281d892305f95/1.21.0/jessie/Dockerfile
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH

RUN set -eux; \
    \
# this "case" statement is generated via "update.sh"
    dpkgArch="$(dpkg --print-architecture)"; \
	case "${dpkgArch##*-}" in \
		amd64) rustArch='x86_64-unknown-linux-gnu'; rustupSha256='f5833a64fd549971be80fa42cffc6c5e7f51c4f443cd46e90e4c17919c24481f' ;; \
		armhf) rustArch='armv7-unknown-linux-gnueabihf'; rustupSha256='67a98a67f7f7bf19c5cde166499acb8299f2f8fa88c155093df53b66da1f512a' ;; \
		arm64) rustArch='aarch64-unknown-linux-gnu'; rustupSha256='82fe368c4ebf1683d57e137242793a4417042639aace8bd514601db7d79d3645' ;; \
		i386) rustArch='i686-unknown-linux-gnu'; rustupSha256='7a1c085591f6c1305877919f8495c04a1c97546d001d1357a7a879cedea5afbb' ;; \
		*) echo >&2 "unsupported architecture: ${dpkgArch}"; exit 1 ;; \
	esac; \
    \
    url="https://static.rust-lang.org/rustup/archive/1.6.0/${rustArch}/rustup-init"; \
    wget "$url"; \
    echo "${rustupSha256} *rustup-init" | sha256sum -c -; \
    chmod +x rustup-init; \
    ./rustup-init -y --no-modify-path --default-toolchain 1.21.0; \
    rm rustup-init; \
    chmod -R a+w $RUSTUP_HOME $CARGO_HOME; \
    rustup --version; \
    cargo --version; \
    rustc --version;

# Install the WebAssembly Emscripten compile target for Rust
RUN rustup target add wasm32-unknown-emscripten

# Install Emscripten SDK.
# https://kripken.github.io/emscripten-site/docs/getting_started/downloads.html

# Install Emscripten SDK dependencies.
RUN echo "deb http://ftp.debian.org/debian jessie-backports main" >> /etc/apt/sources.list \
 && apt-get update && apt-get install -y \
    build-essential \
    default-jre \
 && apt-get -t jessie-backports install -y cmake \
 && rm -rf /var/lib/apt/lists/*

# Install Emscripten SDK for Linux.
RUN wget -q https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz -P /tmp && \
    tar -xvf /tmp/emsdk-portable.tar.gz -C /usr/lib && \
    ln -s /usr/lib/emsdk-portable/emsdk /usr/bin/emsdk && \
    rm /tmp/emsdk-portable.tar.gz

# Setup Emscripten SDK.
RUN emsdk update \
 && emsdk install --build=Release sdk-incoming-64bit binaryen-master-64bit \
 && emsdk activate --build=Release sdk-incoming-64bit binaryen-master-64bit

ENV PATH=/usr/lib/emsdk-portable:$PATH \
    PATH=/usr/lib/emsdk-portable/clang/fastcomp/build_incoming_64/bin:$PATH \
    PATH=/usr/lib/emsdk-portable/emscripten/incoming:$PATH

# Setup Node Project.
WORKDIR /usr/src/match-three
COPY package.json .
COPY yarn.lock .
RUN yarn install && yarn cache clean

# Default Command.
CMD npm run dev
