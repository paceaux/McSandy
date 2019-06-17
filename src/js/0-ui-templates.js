// eslint-disable-next-line no-unused-vars
const UiTemplates = {
    ExternalFileWrapper() {
        const wrapper = document.createElement('div');
        wrapper.className = 'fieldset__inputWrapper';
        return wrapper;
    },
    ExternalFileButton(buttonClass) {
        const button = document.createElement('button');
        button.className = `fieldset__button ${buttonClass}`;
        button.innerHTML = '&mdash;';
        return button;
    },
    ExternalFileSet(file, inputType, inputClass, buttonClass, buttonText) {
        const wrapper = this.ExternalFileWrapper();
        const input = this.Input(inputType, `js-${Math.ceil(Math.random() * 10)}`, inputClass, file, file);
        const button = this.ExternalFileButton(buttonClass, buttonText);
        wrapper.appendChild(input);
        wrapper.appendChild(button);
        return wrapper;
    },
    Input(t, id, c, v, d) {
        const input = document.createElement('input');
        input.type = t;
        input.id = id;
        input.className = c;
        input.value = v;
        input.setAttribute('data-mcsandy', d);
        return input;
    },
    Label(id, c, t) {
        const label = document.createElement('label');
        label.className = c;
        label.setAttribute('for', id);
        label.innerHTML = t;
        return label;
    },
    SelectOption(el) {
        const option = document.createElement('option');
        option.value = el;
        option.text = el;
        return option;
    },
};
