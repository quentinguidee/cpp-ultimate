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

- C/C++ snippets (with auto-space for keywords)

<img width="360" alt="snippets" src="https://user-images.githubusercontent.com/12123721/134800950-00f84e72-7f11-4c2d-816e-536371a2b332.gif" />

- Create C++ class/header/source
- Create CMakeLists.txt file
- Create .clang-format with a gist template

<img width="360" alt="Capture d’écran 2021-09-26 à 10 57 08" src="https://user-images.githubusercontent.com/12123721/134801001-94cbeb93-543e-449a-9bfd-7712c7762e4b.png">

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
    "C_Cpp.autocompleteAddParentheses": true,
}
```

## License

- This extension is released under the [MIT License](./LICENSE.md).
- Some parts of the code are inspired from [vscode-clangd](https://github.com/clangd/vscode-clangd), also released under the [MIT License](https://github.com/clangd/vscode-clangd/blob/master/LICENSE).
