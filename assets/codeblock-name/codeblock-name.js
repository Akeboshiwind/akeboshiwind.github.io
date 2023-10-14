
const extractName = (element) => {
        var classes = element.className.split(" ");
        var nameClass = classes.find(s => s.startsWith("name:"));
        return nameClass.split(":")[1];
}

const renderName = (name) => {
    var element = document.createElement("code");
    element.className = "codeblock-name";
    element.textContent = name;

    var br = document.createElement("br");
    element.appendChild(br);

    return element
}

var elements = document.querySelectorAll('*[class*="name:"]')

elements
    .forEach(element => {
        var name = extractName(element);
        var nameElement = renderName(name);

        element.before(nameElement);
    })
