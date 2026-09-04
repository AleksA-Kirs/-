async function loadComposerWorks(page) {
    const response = await fetch(page);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const works = [];

    doc.querySelectorAll(".work").forEach(function(work) {

        const titleElement = work.querySelector("summary");

        if (!titleElement) {
            return;
        }

        const title = titleElement.textContent.trim();
        const genre = work.dataset.genre || "";

        const files = [];

        work.querySelectorAll("a.download").forEach(function(link) {
            files.push({
                text: link.textContent.trim(),
                href: new URL(link.getAttribute("href"), page).href
            });
        });

        works.push({
            title: title,
            genre: genre,
            files: files
        });
    });

    return works;
}
