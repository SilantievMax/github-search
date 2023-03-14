class UI {
  constructor() {
    this.app = document.querySelector("#app");

    this.title = this.createElement("h1", "ml-4 font-bold text-4xl");
    this.text = this.createElement("div");
    this.title.textContent = "Search Repositorys  Github ";

    this.searchForm = this.createElement("form", "mt-7 max-w-xl w-[576px] flex items-center relative");
    this.searchInput = this.createElement("input", "pl-2 outline-0 w-5/6 h-8 rounded-l-md text-slate-900");
    this.buttonSubmit = this.createElement("button", "outline-0 inline-block w-1/6 bg-purple-900 h-8 rounded-r-md");
    this.buttonSubmit.textContent = "Поиск";
    this.buttonSubmit.type = "submit";

    this.searchForm.append(this.searchInput);
    this.searchForm.append(this.buttonSubmit);

    this.errorText = this.createElement("span", "absolute bottom-10 text-red-600");
    this.errorText.textContent = "Пустая строка*";

    this.reposList = this.createElement("ul", "mt-6 flex justify-center flex-col");

    this.app.append(this.title);
    this.app.append(this.searchForm);
    this.app.append(this.text);
    this.app.append(this.reposList);
  }

  createElement(elemTag, elemClass) {
    const element = document.createElement(elemTag);
    if (elemClass) element.classList = elemClass;
    return element;
  }

  createRepos(data) {
    const repoItem = this.createElement("li", "h-42 min-h-full max-w-xl grid-cols-3 mb-4 flex items-center border rounded-md");
    repoItem.innerHTML = `<div class="p-3 flex items-center justify-center flex-col">
                            <img class="w-16 rounded-full" src="${data.owner.avatar_url}" alt=${data.owner.login} />
                            <a class="underline" href=${data.owner.html_url} target="_blank">${data.owner.login}</a>
                          </div>
                          <div class="p-3 border-l">
                            <a href="${data.html_url}" target="_blank">Репозиторий: <span class="underline">${data.name}</span></a>
                            <p>Описание: ${data.description ? data.description : "-"}</p>
                            <span>Стек: ${data.language}</span>
                          </div>`;
    this.reposList.append(repoItem);
  }

  createNan() {
    const repoItem = this.createElement("li", "");
    repoItem.innerHTML = "Ничего не найдено";
    this.reposList.append(repoItem);
    this.searchInput.value = "";
  }

  createTextSearch(text, count) {
    const repoItem = this.createElement("h3", "mt-6 ");
    repoItem.innerHTML = `По поиску "${text}" всего найдено ${count} репозиторий`;
    this.text.append(repoItem);
  }

  createErrors() {
    this.searchForm.append(this.errorText);
  }
}

class Search {
  constructor(ui) {
    this.ui = ui;
    this.ui.searchForm.addEventListener("submit", this.searchRepos.bind(this));
  }

  async searchRepos(e) {
    e.preventDefault();
    this.ui.reposList.innerHTML = "";
    this.ui.text.innerHTML = "";
    if (!this.ui.searchInput.value) return this.ui.createErrors();

    return await fetch(`https://api.github.com/search/repositories?q=${this.ui.searchInput.value}`).then((res) => {
      if (res.ok) {
        this.ui.errorText.remove()
        res.json().then((res) => {
          if (res.total_count === 0) return this.ui.createNan();
          console.log(res.items.length)
          this.ui.createTextSearch(this.ui.searchInput.value, res.total_count);
          this.ui.searchInput.value = "";
          res.items.forEach((repo) => {
            this.ui.createRepos(repo);
          });
        });
      }
    });
  }
}
new Search(new UI());
