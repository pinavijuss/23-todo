class Todo {
    constructor(IDselector) {
        this.IDselector = IDselector;

        this.DOM = null;
        this.listDOM = null;

        this.addFormDOM = null;
        this.newMessageDOM = null;
        this.newBorderColorDOM = null;
        this.buttonSaveDOM = null;

        this.updateFormDOM = null;
        this.updateMessageDOM = null;
        this.updateBorderColorDOM = null;
        this.buttonUpdateDOM = null;
        this.buttonCancelDOM = null;

        this.localStorageIDcount = 'todosID';
        this.localStorageTodosKey = 'todosList';
        this.latestUsedID = JSON.parse(localStorage.getItem(this.localStorageIDcount)) || 0;
        this.messages = JSON.parse(localStorage.getItem(this.localStorageTodosKey)) || [];

        this.currentlyEditableTaskID = 0;

        this.init();
    }

    init() {
        if (!this.isValidSelector()) {
            return false;
        }

        this.DOM = document.getElementById(this.IDselector);
        if (!this.DOM) {
            console.error('ERROR: nerasta vieta, pagal duota selector');
            return false;
        }
        this.DOM.classList.add('todo');

        this.render();
        this.renderList();
        this.addEvents();
    }

    isValidSelector() {
        if (typeof this.IDselector !== 'string' ||
            this.IDselector === '') {
            console.error('ERROR: nevalidus selector');
            return false;
        }
        return true;
    }

    generateAddForm() {
        return `<form id="add_task">
                    <label for="new_text">Message</label>
                    <input id="new_text" type="text" value="">
                    <label for="new_border_color">Border color</label>
                    <input id="new_border_color" type="color" value="#ff1100">
                    <button id="save_button" type="submit">Save</button>
                    <button type="reset">Reset</button>
                </form>`;
    }

    generateUpdateForm() {
        return `<form id="update_task" class="hide">
                    <label for="updated_text">Message</label>
                    <input id="updated_text" type="text">
                    <label for="updated_border_color">Border color</label>
                    <input id="updated_border_color" type="color">
                    <button id="update_button" type="submit">Update</button>
                    <button id="cancel_button" type="button">Cancel</button>
                </form>`;
    }

    generateList() {
        return `<div class="list"></div>`;
    }

    renderList() {
        for (const task of this.messages) {
            this.renderTask(task.id, task.messageText, task.borderColor);
        }
    }

    renderTask(id, text, borderColor = '#ccc') {
        if (typeof text !== 'string' ||
            text === '') {
            return '';
        }
        const HTML = `<div id="task_${id}" class="task" style="border-color: ${borderColor}">
                            <div class="text">${text}</div>
                            <div class="actions">
                                <div class="btn edit">Edit</div>
                                <div class="btn delete">Delete</div>
                            </div>
                        </div>`;

        this.listDOM.insertAdjacentHTML('afterbegin', HTML);

        const taskDOM = this.listDOM.querySelector('.task');
        const editDOM = taskDOM.querySelector('.edit');
        const deleteDOM = taskDOM.querySelector('.delete');

        deleteDOM.addEventListener('click', () => {
            if (!confirm('Ar tikrai norite istrinti si irasa?')) {
                return false;
            }

            taskDOM.remove();

            this.messages = this.messages.filter((task) => task.id !== id);
            localStorage.setItem(this.localStorageTodosKey, JSON.stringify(this.messages));
        })

        editDOM.addEventListener('click', () => {
            this.addFormDOM.classList.add('hide');
            this.updateFormDOM.classList.remove('hide');

            this.updateMessageDOM.value = text;
            this.updateBorderColorDOM.value = borderColor;
            this.currentlyEditableTaskID = id;
        })
    }

    render() {
        let HTML = '';
        HTML += this.generateAddForm();
        HTML += this.generateUpdateForm();
        HTML += this.generateList();
        this.DOM.innerHTML = HTML;

        this.listDOM = this.DOM.querySelector('.list');

        this.addFormDOM = document.getElementById('add_task');
        this.newMessageDOM = document.getElementById('new_text');
        this.newBorderColorDOM = document.getElementById('new_border_color');
        this.buttonSaveDOM = document.getElementById('save_button');

        this.updateFormDOM = document.getElementById('update_task');
        this.updateMessageDOM = document.getElementById('updated_text');
        this.updateBorderColorDOM = document.getElementById('updated_border_color');
        this.buttonUpdateDOM = document.getElementById('update_button');
        this.buttonCancelDOM = document.getElementById('cancel_button');
    }

    addEvents() {
        // pridedamas uzrasas
        this.buttonSaveDOM.addEventListener('click', (e) => {
            e.preventDefault();

            const message = this.newMessageDOM.value;
            const color = this.newBorderColorDOM.value;

            if (message === '') {
                return false;
            }

            this.messages.push({
                id: ++this.latestUsedID,
                messageText: message,
                borderColor: color
            })

            this.renderTask(this.latestUsedID, message, color);

            localStorage.setItem(this.localStorageIDcount, JSON.stringify(this.latestUsedID));
            localStorage.setItem(this.localStorageTodosKey, JSON.stringify(this.messages));
        })

        this.buttonCancelDOM.addEventListener('click', (e) => {
            e.preventDefault();
            this.addFormDOM.classList.remove('hide');
            this.updateFormDOM.classList.add('hide');
        })

        this.buttonUpdateDOM.addEventListener('click', (e) => {
            e.preventDefault();
            const message = this.updateMessageDOM.value;
            const color = this.updateBorderColorDOM.value;

            for (const task of this.messages) {
                if (task.id === this.currentlyEditableTaskID) {
                    task.messageText = message;
                    task.borderColor = color;
                }
            }
            localStorage.setItem(this.localStorageTodosKey, JSON.stringify(this.messages));

            const taskDOM = this.DOM.querySelector('#task_' + this.currentlyEditableTaskID);
            const taskTextDOM = taskDOM.querySelector('.text');
            taskTextDOM.innerText = message;
            taskDOM.style.borderColor = color;

            this.addFormDOM.classList.remove('hide');
            this.updateFormDOM.classList.add('hide');
        })
    }
}

export { Todo }