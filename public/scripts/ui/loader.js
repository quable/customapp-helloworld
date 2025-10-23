export const removeLoader = () => {
    const loader = document.querySelector('.loader');
    loader.style.display = 'none';

    const content = document.querySelector('#content');
    content.classList.remove('d-none');
}

export const showLoader = () => {
    const loader = document.querySelector('.loader');
    loader.style.display = 'block';

    const content = document.querySelector('#content');
    content.classList.add('d-none');
}

export const createLoader = () => {
    const element = document.createElement('i');
    element.classList.add('bx', 'bx-loader-alt', 'bx-spin', 'text-primary');
    return element;
}