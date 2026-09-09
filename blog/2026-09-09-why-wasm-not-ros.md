---
slug: why-wasm-not-ros
title: Why WebAssembly Instead of ROS or ROS 2?
authors: [jaegyeom]
tags: [robotics, webassembly, modern-robotics]
description: Why this blog uses WebAssembly for an interactive browser demo instead of ROS or ROS 2.
---

ROS and ROS 2 are excellent choices for building complete robot systems. They provide communication, tools, drivers, visualization, and a large ecosystem.

This blog post has a narrower goal: make the mathematics of kinematics, planning, and dynamics visible and runnable in a browser.

<!-- truncate -->

## A different problem

This blog post is not trying to operate a robot or connect multiple hardware nodes. It demonstrates forward kinematics, inverse kinematics, motion planning, and dynamics.

For that purpose, the main requirement is a small, self-contained program that anyone can open and run without preparing a robotics development environment.

## Why WebAssembly fits

- **No installation:** visitors do not need ROS, ROS 2, a workspace, or system packages.
- **Runs in the browser:** the same page works on Linux, macOS, Windows, and mobile devices.
- **Interactive visualization:** sliders and 3D controls can call the compiled algorithms immediately.
- **Native implementation:** the computational core remains C++ and is compiled to WebAssembly rather than rewritten in JavaScript.
- **Easy sharing:** a static site can host the complete example without a backend or robot middleware.

## What ROS or ROS 2 would add

ROS or ROS 2 would be the better choice when the example needs hardware drivers, sensor streams, distributed nodes, robot description files, lifecycle management, or integration with a larger autonomy stack.

Those are system-integration requirements, not requirements for explaining the underlying mathematics. ROS and ROS 2 organize a running robot system, while WebAssembly packages a computation so that it can run inside a web page.

## The practical boundary

The browser demo keeps the algorithmic core small and observable. A real robot application can still use the same C++ concepts inside a ROS or ROS 2 node, where middleware connects the planner and controller to sensors, actuators, and other processes.

For this project, WebAssembly is a presentation and distribution choice. It lowers the barrier to experimentation while keeping the robotics implementation close to the native C++ code.