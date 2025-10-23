export const renderErrorView = (message, onBtnClick) => {
    const oldErrorView = document.querySelector('.error-view');
    if (oldErrorView) {
        oldErrorView.remove()
    }

    const element = document.createElement('div');
    element.classList.add('text-center', 'error-view')

    const p = document.createElement('p');
    p.classList.add('m-0', 'p-0', 'my-2');
    p.textContent = message;

    const btn = document.createElement('btn');
    btn.classList.add('btn', 'btn-primary');
    btn.textContent = 'Refresh';

    btn.addEventListener('click', () => {
        onBtnClick()
    })

    element.append(p);
    element.append(btn);

    return element;
}