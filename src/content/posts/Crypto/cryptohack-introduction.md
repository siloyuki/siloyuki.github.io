---
title: "CryptoHack 가입 및 Introduction 풀이"
published: 2026-04-08
description: "cryptohack.org 가입 후 Introduction to CryptoHack 카테고리 문제 풀이 정리"
tags: [Crypto, CryptoHack, 암호학]
category: Crypto
draft: false
---

## CryptoHack이란?

[CryptoHack](https://cryptohack.org)은 암호학을 게임처럼 배울 수 있는 워게임 플랫폼이다.
RSA, 타원곡선, 대칭키 암호 등 다양한 분야의 문제를 단계적으로 풀며 개념을 익힐 수 있다.

가입 후 바로 **Introduction to CryptoHack** 카테고리부터 시작하게 된다.

---

## Introduction to CryptoHack

입문 카테고리로, 플랫폼 사용법과 기초 개념을 익히는 문제들로 구성되어 있다.

### Finding Flags

플래그 형식은 `crypto{...}` 이다. 문제를 풀면 이 형태의 문자열을 제출한다.

```
crypto{y0ur_f1rst_fl4g}
```

### Great Snakes

Python 환경에서 스크립트를 실행해 플래그를 얻는 문제다.
주어진 `.py` 파일을 실행하면 플래그가 출력된다.

```python
# 실행 결과
crypto{sn4k3s_0n_4_pl4n3}
```

> Python 3 환경이 있으면 바로 풀 수 있다.

### Network Attacks

`netcat`으로 서버에 접속해 플래그를 받는 문제다.

```bash
nc socket.cryptohack.org 11112
```

접속하면 JSON 형태로 플래그를 돌려준다.

---

## 마치며

Introduction 카테고리는 플랫폼 적응을 위한 워밍업 단계라 난이도가 낮다.
이후 **General** → **Mathematics** → **RSA** 순서로 진행하는 것을 권장한다.
