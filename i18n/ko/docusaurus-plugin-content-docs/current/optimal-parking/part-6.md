---
title: Optimal Parking, Part 6 - C++ 구조와 WebAssembly 데모
authors: [endi]
tags: [robotics, c++, webassembly, optimal-parking]
description: 네이티브 플래너의 구조와 인터랙티브 브라우저 실험을 위해 WebAssembly로 노출하는 방식을 설명합니다.
---

이 프로젝트는 플래닝 알고리즘을 C++로 유지하고 브라우저를 인터랙티브 프론트엔드로 사용합니다. 따라서 네이티브 예제와 WebAssembly 데모에서 같은 모델과 solver를 실험할 수 있습니다.

<!-- truncate -->

## 1. 네이티브 플래닝 처리 과정

상위 수준의 흐름은 다음과 같습니다.

1. YAML에서 차량, 맵, 범위, 가중치, 플래너 매개변수를 읽습니다.
2. RRT*로 초기 경로를 만듭니다.
3. 경로를 최적화기의 상태와 입력 시퀀스로 변환합니다.
4. SQP-like QP 개선 반복을 실행합니다.
5. 시각화를 위해 궤적, 상태 이력, solver 결과를 반환합니다.

라이브러리는 C++20으로 빌드하며, 행렬 연산에는 Eigen, 설정 파싱에는 yaml-cpp, QP 인터페이스에는 OsqpEigen을 사용합니다.

## 2. solver를 C++로 유지하는 이유

차량 모델, sparse matrix 구성, 반복적인 최적화 loop는 컴파일된 구현의 이점을 얻습니다. 또한 프론트엔드가 플래너를 JavaScript로 다시 구현하지 않으므로 네이티브 예제와 브라우저 데모의 동작을 일치시킬 수 있습니다.

WebAssembly binding은 `optimal_parking/bindings/wasm/bindings.cpp`를 통해 trajectory optimizer를 노출합니다. `web/`의 React와 webpack 애플리케이션은 pose, obstacle, parameter를 편집하는 UI를 제공합니다.

## 3. 인터랙티브 실험

데모는 플래닝 loop를 눈에 보이게 만듭니다. 차량과 장애물을 움직이고, 초기 및 목표 pose를 바꾸고, SQP parameter를 조정한 뒤 플래너를 실행할 수 있습니다. 결과는 애니메이션으로 표시되고 수렴 정보는 결과 패널에 나타납니다.

이 방식은 매개변수 민감도를 이해하는 데 유용합니다. 안전 여유, 예측 구간, 패널티, 장애물 배치를 바꾸면 초기 RRT* 경로와 QP 시퀀스가 찾을 수 있는 국소 궤적이 모두 달라질 수 있습니다.

## 4. 재현 가능한 빌드

저장소에는 네이티브 CMake 빌드와 WebAssembly 빌드 방법이 모두 문서화되어 있습니다. 브라우저 버전은 먼저 dependency와 WASM module을 빌드한 뒤, GitHub Pages에 배포할 정적 프론트엔드를 빌드합니다.

[cmaybe.github.io/Optimal-Parking](https://cmaybe.github.io/Optimal-Parking/)에서 데모를 실행할 수 있습니다. 마지막 챕터에서는 지금까지의 구성 요소가 하나의 흐름으로 어떻게 연결되는지 정리합니다.
