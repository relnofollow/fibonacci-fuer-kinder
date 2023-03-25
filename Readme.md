## Fibonacci Generator

The main idea is to implement the app in vanilla JavaScript and CSS, without using any JavaScript and CSS frameworks.

### How to run project locally

```
> npm install
> npm start
```

### Localization

Project localization is done using NPM package [static-i18n](https://www.npmjs.com/package/static-i18n).  
A template of index.html is placed in `www/index.html` and converted to the list of localized index.html files by command 

```
> npm run i18n
```

The translated files are placed in directory 'i18n' and then processed by webpack.

### How to contribute

Please feel free to open PRs with translations to new languages.  
Copy 'en.json' file from 'locales' folder with a new language code and add translations.