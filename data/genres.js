async function loadAllComposers() {

    const response = await fetch(
        "https://api.github.com/repos/aleksa-kirs/music-library/contents/"
    );

    const items = await response.json();

    const composers = [];

    for (const item of items) {

        if (item.type !== "dir") {
            continue;
        }

        const page = "../" + item.name + "/";

        try {

            const pageResponse = await fetch(page);

            if (!pageResponse.ok) {
                continue;
            }

            const html = await pageResponse.text();

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
                        href: new URL(
                            link.getAttribute("href"),
                            page
                        ).href
                    });

                });

                works.push({
                    title: title,
                    genre: genre,
                    files: files
                });

            });

            if (works.length > 0) {

                const title =
                    doc.querySelector("h1")?.textContent.trim()
                    || item.name;

                composers.push({
                    name: title,
                    page: page,
                    works: works
                });
            }

        } catch (error) {

            console.log(
                "Не удалось прочитать:",
                item.name,
                error
            );

        }
    }

    return composers;
}
