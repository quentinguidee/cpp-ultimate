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

- Language server (Clangd) running in background
- C/C++ snippets from clangd and slightly improved (trailing space for keywords, remove hints...)
- Constructor/destructor

<img width="400" alt="constructor" src="https://user-images.githubusercontent.com/12123721/136666837-be333682-68f5-4b7e-ab2e-13f696b2d626.gif">

- Switch between header/source
- Create C++ class/header/source
- Create CMakeLists.txt file
- Create .clang-format with a gist template

<img width="400" alt="menus" src="https://user-images.githubusercontent.com/12123721/134801001-94cbeb93-543e-449a-9bfd-7712c7762e4b.png">

## Extension Settings

This extension contributes the following settings:

- `cpp-ultimate.hints-in-snippets`: Show hints in snippets. Disabled by default.
- `cpp-ultimate.clang-format.gist-id`: Gist ID of your clang-format file. The file must be named .clang-format to work.
- `cpp-ultimate.files.header-extension`: header extension (.h, .hxx, .hpp)
- `cpp-ultimate.files.source-extension`: source extension (.c, .cxx, .cpp)

## Recommended settings

Those settings from VSCode can improve your typing experience with C++ Ultimate :

```json
{
    "editor.suggest.snippetsPreventQuickSuggestions": false,
}
```

## License

- This extension is released under the [MIT License](./LICENSE.md).
- Some parts of the code are inspired from [vscode-clangd](https://github.com/clangd/vscode-clangd), also released under the [MIT License](https://github.com/clangd/vscode-clangd/blob/master/LICENSE).
