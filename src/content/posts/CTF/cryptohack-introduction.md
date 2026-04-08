---
title: "CryptoHack 가입 및 Introduction 풀이"
published: 2026-04-08
description: "cryptohack.org 가입 후 Introduction to CryptoHack 카테고리 문제 풀이 정리"
tags: [Crypto, CryptoHack, 암호학]
category: CTF/Wargame
draft: false
---

## CryptoHack 가입

[CryptoHack](https://cryptohack.org)은 암호학 문제를 풀며 공부할 수 있는 워게임 플랫폼이다.

가입하려면 **Roman emperor's cipher** 문제를 직접 풀어야 한다.

## Roman emperor's cipher

Caesar Cipher로 암호화된 문자열을 복호화하는 문제다.

입력 문자열이 대문자로만 구성되어 있어 wrap-around도 `shifted -= 26` 한 줄로 처리할 수 있었다. shift 1~25를 전부 시도해 의미 있는 문장을 찾으면 된다.

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

---

## Introduction to CryptoHack

가입 후 풀 수 있는 입문 카테고리. 1, 2번은 플래그를 그대로 받아쓰는 문제라 생략.

### 3. ASCII Numbers

아스키코드 배열을 문자로 변환하면 플래그가 나오는 문제다. `(char)` 캐스팅으로 처리했다.

```cpp
#include <iostream>
using namespace std;

int main()
{
    int arr[] = { 99, 114, 121, 112, 116, 111, 123, 65, 83, 67, 73, 73, 95, 112, 114, 49, 110, 116, 52, 98, 108, 51, 125 };

    for (int i = 0; i < size(arr); i++)
    {
        cout << (char)arr[i];
    }
}
```

### 4. Hex to ASCII

hex 문자열을 2자리씩 잘라 `stoi`로 16진수 변환 후 `(char)` 캐스팅했다.

```cpp
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string hex = "63727970746f7b596f755f77696c6c5f62655f776f726b696e675f776974685f6865785f737472696e67735f615f6c6f747d";

    for (int i = 0; i < hex.length(); i += 2)
    {
        string s = hex.substr(i, 2);
        char c = (char)stoi(s, nullptr, 16);
        cout << c;
    }
    cout << endl;
}
```

### 5. Base64 Encoding

4번에 Base64 인코딩이 추가된 문제다. C++에서 Base64 로직을 직접 구현하는 건 번거로우므로 Python을 사용했다.

```python
import base64

hex = "72bca9b68fc16ac7beeb8f849dca1d8a783e8acf9679bf9269f7bf"

print(base64.b64encode(bytes.fromhex(hex)).decode())
```

### 6. Bytes and Big Integers

10진수 정수를 16진수로 변환하고, 이를 바이트로 변환 후 문자열로 디코딩하는 문제다.

```python
n = 11515195063862318899931685488813747395775516287289682636499965282714637259206269

print(bytes.fromhex(hex(n)[2:]).decode())
```

### 7. XOR Starter

13과 `"label"`을 XOR하는 문제다.

```cpp
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string s = "label";

    for (int i = 0; i < s.length(); i++)
    {
        cout << (char)(s[i] ^ 13);
    }
}
```

### 8. XOR Properties

XOR의 연산법칙에 관한 문제다.

```cpp
#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <string>
using namespace std;

string Xor_Hex(string a, string b);

int main()
{
    string key1 = "a6c8b6733c9b22de7bc0253266a3867df55acde8635e19c73313";
    string k2frk1 = "37dcb292030faa90d07eec17e3b1c6d8daf94c35d4c9191a5e1e";
    string k3frk2 = "c1545756687e7573db23aa1c3452a098b71a7fbf0fddddde5fc1";
    string flagfrk3 = "04ee9855208a2cd59091d04767ae47963170d1660df7f56f5faf";
    
    string key2 = Xor_Hex(key1, k2frk1);
    string key3 = Xor_Hex(key2, k3frk2);
    string flag = Xor_Hex(Xor_Hex(Xor_Hex(key2, flagfrk3), key3), key1);

    for (int i = 0; i < flag.length(); i += 2)
    {
        cout << (char)stoi(flag.substr(i, 2), nullptr, 16);
    }
}

string Xor_Hex(string a, string b)
{
    string result;
    for (int i = 0; i < a.length(); i += 2)
    {
        int ia = stoi(a.substr(i, 2), nullptr, 16);
        int ib = stoi(b.substr(i, 2), nullptr, 16);
        char c[3];

        sprintf(c, "%02x", ia ^ ib);
        result += c;
    }
    return result;
}
```

### 9. Favourite byte

hex 문자열을 디코딩한 뒤, 0~255 키로 브루트포스 XOR해 플래그를 찾는 문제다.

플래그가 `crypto{`로 시작한다는 걸 이용하면 첫 바이트 `0x73 ^ key = 0x63('c')`에서 key = `0x10`(16)임을 바로 알 수 있다.

```cpp
#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include <string>
using namespace std;

int main()
{
    string hex = "73626960647f6b206821204f21254f7d694f7624662065622127234f726927756d";
    string s = "";

    for (int i = 0; i < hex.length(); i += 2)
    {
        s += (char)stoi(hex.substr(i, 2), nullptr, 16);
    }

    for (int key = 0; key <= 255; key++)
    {
        cout << key << ": ";
        for (int i = 0; i < s.length(); i++)
        {
            cout << (char)(s[i] ^ key);
        }
        cout << endl;
    }
}
```

출력 중 `16:` 줄에서 플래그 `crypto{0x10_15_my_f4v0ur173_by7e}`가 나온다.
