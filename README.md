<p align="center">
    <img width="256" height="256" src="https://github.com/quentinguidee/CPP-Ultimate/raw/master/icon-1024.png" />
</p>
<h1 align="center">C++ Ultimate</h1>

<p align="center">
<a src="https://marketplace.visualstudio.com/items?itemName=quentinguidee.cpp-ultimate&ssr=false#overview"><img alt="Visual Studio Marketplace Version" src="https://img.shields.io/visual-studio-marketplace/v/quentinguidee.cpp-ultimate?style=for-the-badge&color=red&logo=visual-studio-code"></a>
<img alt="GitHub" src="https://img.shields.io/github/license/quentinguidee/CPP-Ultimate?style=for-the-badge&color=red&logo=open-source-initiative&logoColor=white">
</p>

---

Ultimate extensions are a group of extensions allowing faster coding in VSCode. C++ Ultimate allows to speed up the drafting of `C` and `C++` files.

## Features

- C/C++ snippets
- Create C++ class/header/source
- Create CMakeLists.txt file
- Create .clang-format with a gist template

## Extension Settings

This extension contributes the following settings:

- `cpp-ultimate.clang-format.gist-id`: Gist ID of your clang-format file. The file must be named .clang-format to work.
- `cpp-ultimate.files.header-extension`: header extension (.h, .hxx, .hpp)
- `cpp-ultimate.files.source-extension`: source extension (.c, .cxx, .cpp)

## Recommended settings

Those settings from VSCode can improve your typing experience with C++ Ultimate :

```json
{
    "editor.suggest.snippetsPreventQuickSuggestions": false,
    "C_Cpp.autocompleteAddParentheses": true,
}
```

## License

This extension is released under the [MIT License](./LICENSE.md)
