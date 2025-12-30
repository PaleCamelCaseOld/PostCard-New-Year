const translations = {
  ru: {
    friends: "Друзья,",
    newYear: "с Новым годом!",
    wish: "Желаю Вам удачи и успехов. Пусть новый год будет таким, каким его видите Вы!",
    author: "© alexvit93, Декабрь 2025",
  },
  by: {
    friends: "Сябры,",
    newYear: "Вiншую з Новым годам!",
    wish: "Жадаю вам посьпехаў. Няхай Новы год будзе такім, якім яго бачыце Вы!",
    author: "© alexvit93, Снежань 2025",
  },
  en: {
    friends: "Friends,",
    newYear: "Happy New Year!",
    wish: "Wishing you good luck and success. May the new year be exactly how you imagine it!",
    author: "© alexvit93, December 2025",
  },
  de: {
    friends: "Freunde,",
    newYear: "Frohes neues Jahr!",
    wish: "Ich wünsche Ihnen viel Glück und Erfolg. Möge das neue Jahr so werden, wie Sie es sich vorstellen!",
    author: "© alexvit93, Dezember 2025",
  },
  ua: {
    friends: "Друзі,",
    newYear: "з Новим роком!",
    wish: "Бажаю вам удачі та успіхів. Нехай новий рік буде таким, яким Ви його бачите!",
    author: "© alexvit93, Грудень 2025",
  },
  lt: {
    friends: "Draugai,",
    newYear: "Su Naujaisiais metais!",
    wish: "Linkiu sėkmės ir pasisekimo. Tegul naujieji metai būna tokie, kokius juos įsivaizduojate!",
    author: "© alexvit93, Gruodis 2025",
  },
  lv: {
    friends: "Draugi,",
    newYear: "Laimīgu Jauno gadu!",
    wish: "Novēlu veiksmi un panākumus. Lai jaunais gads ir tāds, kādu jūs to redzat!",
    author: "© alexvit93, Decembris 2025",
  },
  ka: {
    friends: "მეგობრებო,",
    newYear: "გილოცავთ ახალ წელს!",
    wish: "გისურვებთ წარმატებას და კეთილდღეობას. დაე, ახალი წელი იყოს ისეთი, როგორსაც თქვენ წარმოიდგენთ!",
    author: "© alexvit93, დეკემბერი 2025",
  },
  kz: {
    friends: "Достар,",
    newYear: "Жаңа жылмен!",
    wish: "Сізге сәттілік пен табыс тілеймін. Жаңа жыл сіз қалағандай болсын!",
    author: "© alexvit93, Желтоқсан 2025",
  },
};

class LanguageResolver {
  constructor(translations, defaultLang = "ru") {
    this.translations = translations;
    this.defaultLang = defaultLang;
    this.supported = Object.keys(translations);
  }

  fromPath() {
    return this.supported.find((lang) => lang === location.pathname.slice(1));
  }

  fromQuery() {
    return this.supported.find(
      (lang) => lang === new URLSearchParams(location.search).get("lang")
    );
  }

  fromBrowser() {
    return this.supported.find(
      (lang) => lang === navigator.language.slice(0, 2)
    );
  }

  resolve() {
    return (
      this.fromPath() ||
      this.fromQuery() ||
      this.fromBrowser() ||
      this.defaultLang
    );
  }
}

function setLanguage(lang) {
  const dict = translations[lang] ?? translations.ru;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = dict[el.dataset.i18n];
  });
  const pathMap = {
    ru: "/",
  };
  history.pushState({}, "", `${location.origin}/?lang=${lang}`);
}

document.querySelectorAll(".lang-switch button").forEach((btn) => {
  btn.addEventListener("click", () => {
    setLanguage(btn.dataset.lang);
  });
});

const resolver = new LanguageResolver(translations);
setLanguage(resolver.resolve());
