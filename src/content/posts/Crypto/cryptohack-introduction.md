---
title: "CryptoHack 가입 및 Introduction 풀이"
published: 2026-04-08
description: "cryptohack.org 가입 후 Introduction to CryptoHack 카테고리 문제 풀이 정리"
tags: [Crypto, CryptoHack, 암호학]
category: Crypto
draft: false
---

## CryptoHack 가입

[CryptoHack](https://cryptohack.org)은 암호학 문제를 풀며 공부할 수 있는 워게임 플랫폼이다.

가입하려면 단순히 이메일을 입력하는 게 아니라, **Roman emperor's cipher** 문제를 직접 풀어야 회원가입이 완료된다. 시저 암호(Caesar Cipher)로 암호화된 문자열을 해독하는 문제다.

## 풀이

시저 암호는 알파벳을 일정 칸만큼 밀어 암호화하는 방식이다. 키를 모르므로 1~25 모든 경우를 출력해 의미 있는 문장을 찾으면 된다.

```cpp
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string input;
    getline(cin, input);

    for (int i = 1; i <= 25; i++)
    {
        cout << i << ":";
        for (int idx = 0; idx < input.length(); idx++)
        {
            char original = input[idx];

            if (original == ' ')
            {
                cout << ' ';
                continue;
            }

            char shifted = original + i;
            if (shifted >= 'A' && shifted <= 'Z')
            {
                cout << shifted;
            }
            else
            {
                shifted -= 26;
                cout << shifted;
            }
        }
        cout << endl;
    }
}
```

암호화된 문자열을 입력하면 shift 1~25 결과를 전부 출력한다. 출력 중 자연스러운 영어 문장이 보이는 시점이 정답이다.

가입에 성공하면 이후 Introduction to CryptoHack 카테고리 문제를 풀 수 있다.
