---
title: Optimal Parking, Part 6 - C++ Architecture and the WebAssembly Demo
authors: [jaegyeom]
tags: [robotics, c++, webassembly, optimal-parking]
description: How the native planner is organized and exposed through WebAssembly for interactive browser experiments.
---

The project keeps the planning algorithm in C++ and uses the browser as an interactive front end. This separation makes it possible to experiment with the same model and solver in a native example and in the WebAssembly demo.

<!-- truncate -->

## 1. Native planning pipeline

The high-level flow is:

1. Load vehicle, map, bounds, weights, and planner parameters from YAML.
2. Build an initial route with RRT*.
3. Convert the route into an optimizer state and input sequence.
4. Run the SQP-like QP refinement loop.
5. Return the trajectory, state history, and solver readout for visualization.

The library is built with C++20 and uses Eigen for matrix operations, yaml-cpp for configuration, and OsqpEigen as the QP interface.

## 2. Why keep the solver in C++

The vehicle model, sparse matrix construction, and repeated optimization loop benefit from a compiled implementation. It also keeps the native example and browser demo aligned: the front end does not reimplement the planner in JavaScript.

The WebAssembly binding exposes the trajectory optimizer through `optimal_parking/bindings/wasm/bindings.cpp`. The React and webpack application in `web/` supplies editable poses, obstacles, and parameters.

## 3. Interactive experimentation

The demo makes the planning loop visible. A user can move the car and obstacles, change the initial and goal poses, adjust SQP parameters, and run the planner. The result is animated while convergence information appears in the readout panel.

This is valuable for understanding sensitivity. Changing a safety margin, horizon, penalty, or obstacle arrangement can alter both the initial RRT* route and the local trajectory that the QP sequence can find.

## 4. Reproducible builds

The repository documents both a native CMake build and a WebAssembly build. The browser version first builds its dependencies and WASM module, then builds the frontend into a static directory deployed to GitHub Pages.

The live demo is available at [cmaybe.github.io/Optimal-Parking](https://cmaybe.github.io/Optimal-Parking/). The final chapter summarizes how all of these pieces fit together.
