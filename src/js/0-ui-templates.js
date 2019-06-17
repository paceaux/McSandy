// eslint-disable-next-line no-unused-vars
const UiTemplates = {
    ExternalFileWrapperTemplate() {
        const wrapper = document.createElement('div');
        wrapper.className = 'fieldset__inputWrapper';
        return wrapper;
    },
    ExternalFileButtonTemplate(buttonClass) {
        const button = document.createElement('button');
        button.className = `fieldset__button ${buttonClass}`;
        button.innerHTML = '&mdash;';
        return button;
    },
    ExternalFileSetTemplate(file, inputType, inputClass, buttonClass, buttonText) {
        const wrapper = this.ExternalFileWrapperTemplate();
        const input = this.InputTemplate(inputType, `js-${Math.ceil(Math.random() * 10)}`, inputClass, file, file);
        const button = this.ExternalFileButtonTemplate(buttonClass, buttonText);
        wrapper.appendChild(input);
        wrapper.appendChild(button);
        return wrapper;
    },
    InputTemplate(t, id, c, v, d) {
        const input = document.createElement('input');
        input.type = t;
        input.id = id;
        input.className = c;
        input.value = v;
        input.setAttribute('data-mcsandy', d);
        return input;
    },
    LabelTemplate(id, c, t) {
        const label = document.createElement('label');
        label.className = c;
        label.setAttribute('for', id);
        label.innerHTML = t;
        return label;
    },
    SelectOptionTemplate(el) {
        const option = document.createElement('option');
        option.value = el;
        option.text = el;
        return option;
    },
};
