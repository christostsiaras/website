const languagesChange = {
    phrases: null,
    polyglot: null,
    init: function() {
      const langSelect = document.querySelector('#language');
      langSelect.addEventListener('change', languagesChange.onLanguageChange);
  
      languagesChange.loadPhrases(langSelect.value)
        .then(() => {
          const defaultLanguage = langSelect.value;
          languagesChange.updateUI(defaultLanguage);
        });
    },
    loadPhrases: function(lang) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('GET', `assets/lang/${lang}.json`);
          xhr.onload = function() {
            if (xhr.status === 200) {
              const newPhrases = JSON.parse(xhr.responseText);
              // Merge the new phrases with the existing ones
              languagesChange.phrases = Object.assign({}, languagesChange.phrases, newPhrases);
              languagesChange.polyglot = new Polyglot({phrases: languagesChange.phrases});
              resolve();
            } else {
              // Failed to load the selected language, so try loading English
              const xhrEn = new XMLHttpRequest();
              xhrEn.open('GET', `assets/lang/en.json`);
              xhrEn.onload = function() {
                if (xhrEn.status === 200) {
                  const englishPhrases = JSON.parse(xhrEn.responseText);
                  // Filter the missing phrases from the English translations
                  const missingPhrases = Object.keys(languagesChange.phrases).filter(key => !newPhrases.hasOwnProperty(key));
                  const filteredEnglishPhrases = Object.fromEntries(Object.entries(englishPhrases).filter(([key]) => missingPhrases.includes(key)));
                  // Merge the filtered English phrases with the existing ones
                  languagesChange.phrases = Object.assign({}, languagesChange.phrases, filteredEnglishPhrases);
                  languagesChange.polyglot = new Polyglot({phrases: languagesChange.phrases});
                  resolve();
                } else {
                  // Failed to load English translations as well, so reject the promise
                  reject('Failed to load phrases');
                }
              };
              xhrEn.send();
            }
          };
          xhr.send();
        });
      },
      
    onLanguageChange: function() {
      const lang = this.value;
      languagesChange.loadPhrases(lang)
        .then(() => {
          languagesChange.updateUI(lang);
        });
    },
    updateUI: function(lang) {
      const hw = languagesChange.polyglot.t('hello-world');
      const desc = languagesChange.polyglot.t('description');
  
      document.querySelector('#hello-world').textContent = hw;
      document.querySelector('#description').textContent = desc;
    }
  };
  
  