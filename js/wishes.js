const translations = {
  ru: {
    friends: "Друзья,",
    newYear: "с Новым годом!",
    wish: "Желаю Вам удачи и успехов. Пусть новый год будет таким, каким его видите Вы!",
    author: "© PaleCame, Декабрь 2025",
  },
  by: {
    friends: "Сябры,",
    newYear: "Вiншую з Новым годам!",
    wish: "Жадаю вам посьпехаў. Няхай Новы год будзе такім, якім яго бачыце Вы!",
    author: "© PaleCame, Снежань 2025",
  },
  en: {
    friends: "Friends,",
    newYear: "Happy New Year!",
    wish: "Wishing you good luck and success. May the new year be exactly how you imagine it!",
    author: "© PaleCame, December 2025",
  },
  pl: {
    friends: "Przyjaciele,",
    newYear: "Szczęśliwego Nowego Roku!",
    wish: "Życzę Wam powodzenia i sukcesów. Niech Nowy Rok będzie dokładnie taki, jaki sobie wyobrażacie!",
    author: "© PaleCame, Grudzień 2025",
  },
  bg: {
    friends: "Приятели,",
    newYear: "Честита Нова година!",
    wish: "Пожелавам ви късмет и успехи. Нека Новата година бъде точно такава, каквато си я представяте!",
    author: "© PaleCame, Декември 2025",
  },
  es: {
    friends: "Amigos,",
    newYear: "¡Feliz Año Nuevo!",
    wish: "Les deseo buena suerte y éxito. ¡Que el nuevo año sea exactamente como lo imaginan!",
    author: "© PaleCame, Diciembre 2025",
  },
  de: {
    friends: "Freunde,",
    newYear: "Frohes neues Jahr!",
    wish: "Ich wünsche Ihnen viel Glück und Erfolg. Möge das neue Jahr so werden, wie Sie es sich vorstellen!",
    author: "© PaleCame, Dezember 2025",
  },
  ua: {
    friends: "Друзі,",
    newYear: "з Новим роком!",
    wish: "Бажаю вам удачі та успіхів. Нехай новий рік буде таким, яким Ви його бачите!",
    author: "© PaleCame, Грудень 2025",
  },
  lt: {
    friends: "Draugai,",
    newYear: "Su Naujaisiais metais!",
    wish: "Linkiu sėkmės ir pasisekimo. Tegul naujieji metai būna tokie, kokius juos įsivaizduojate!",
    author: "© PaleCame, Gruodis 2025",
  },
  lv: {
    friends: "Draugi,",
    newYear: "Laimīgu Jauno gadu!",
    wish: "Novēlu veiksmi un panākumus. Lai jaunais gads ir tāds, kādu jūs to redzat!",
    author: "© PaleCame, Decembris 2025",
  },
  ka: {
    friends: "მეგობრებო,",
    newYear: "გილოცავთ ახალ წელს!",
    wish: "გისურვებთ წარმატებას და კეთილდღეობას. დაე, ახალი წელი იყოს ისეთი, როგორსაც თქვენ წარმოიდგენთ!",
    author: "© PaleCame, დეკემბერი 2025",
  },
  kz: {
    friends: "Достар,",
    newYear: "Жаңа жылмен!",
    wish: "Сізге сәттілік пен табыс тілеймін. Жаңа жыл сіз қалағандай болсын!",
    author: "© PaleCame, Желтоқсан 2025",
  },
};

class LanguageResolver {
  constructor(translations, defaultLang = "ru") {
    this.translations = translations;
    this.defaultLang = defaultLang;
    this.supported = Object.keys(translations);
    this.countryToLang = {
      RU: "ru",
      BY: "by",
      UA: "ua",
      LT: "lt",
      LV: "lv",
      DE: "de",
      GE: "ka",
      KZ: "kz",
      ES: "es",
      PL: "pl",
      BG: "bg",
    };
  }

  fromPath() {
    return this.supported.find((lang) => lang === location.pathname.slice(1));
  }

  fromQuery() {
    return this.supported.find(
      (lang) => lang === new URLSearchParams(location.search).get("lang")
    );
  }

  fromHash() {
    const hash = location.hash.slice(1);
    const params = new URLSearchParams(hash);
    return this.supported.find((lang) => lang === params.get("lang"));
  }

  fromBrowser() {
    return this.supported.find(
      (lang) => lang === navigator.language.slice(0, 2)
    );
  }

  async fromIP() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const response = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!response.ok) return null;
      const data = await response.json();
      const countryCode = data.country_code;
      return this.countryToLang[countryCode];
    } catch (error) {
      if (error.name !== "AbortError") {
        console.log("IP определение пропущено");
      }
      return null;
    }
  }

  async resolve() {
    const explicitLang = this.fromHash() || this.fromPath() || this.fromQuery();
    if (explicitLang) return explicitLang;
    try {
      const ipLang = await this.fromIP();
      if (ipLang && this.supported.includes(ipLang)) {
        return ipLang;
      }
    } catch (error) {
      console.log("Не удалось определить язык по IP, используем браузерный...");
    }
    return this.fromBrowser() || this.defaultLang;
  }
}

function setLanguage(lang) {
  const dict = translations[lang] ?? translations.ru;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = dict[el.dataset.i18n];
  });
  window.location.hostname.includes("localhost")
    ? null
    : (location.hash = lang === "ru" ? "" : `lang=${lang}`);
}

document.querySelectorAll(".lang-switch button").forEach((btn) => {
  btn.addEventListener("click", () => {
    setLanguage(btn.dataset.lang);
  });
});

async function init() {
  const resolver = new LanguageResolver(translations);
  const lang = await resolver.resolve();
  setLanguage(lang);
}

init();
