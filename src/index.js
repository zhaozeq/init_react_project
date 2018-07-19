function component() {
    var element = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = 'Hello,World！';
    return element;
}
document.getElementById('root').appendChild(component());