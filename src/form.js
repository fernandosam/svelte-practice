const module = () => {
    // Form field errors
    function showFieldError(input, message) {
        function addInvalidField(input) {
            input.classList.add("is-invalid");
        }

        function removeInvalidField(div, input) {
            if (div.parentNode) {
                div.parentNode.removeChild(div);
                input.classList.remove("is-invalid");
            }
        }

        function addInvalidFeedback(div, input) {
            div.classList.add("invalid-feedback");
            showErrorMessage(div, input);
        }

        function showErrorMessage(div, input) {
            div.appendChild(document.createTextNode(message));
            input.parentNode.insertBefore(div, input.nextSibling);
        }

        addInvalidField(input);

        if (!input.nextSibling) {
            let div = document.createElement("div");
            addInvalidFeedback(div, input);
            input.addEventListener("keypress", () => {
                removeInvalidField(div, input);
            });
            input.addEventListener("change", () => {
                removeInvalidField(div, input);
            });
        }
    }

    function hiddenFieldError(input) {
        input.classList.remove("is-invalid");
    }

    // Validate all inputs
    function validateRequiredInputs(inputs) {
        let validate = false;
        let invalids = 0;

        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            let required = input.previousElementSibling.className;

            required = required.includes("required");

            if (required && input.value === "") {
                invalids++;
                showFieldError(input, "Campo Obrigatório");
            } else {
                hiddenFieldError(input);
            }
        }

        invalids ? (validate = false) : (validate = true);

        return validate;
    }

    return {
        focusFirstElement: (formId) => {
            var elements = document.getElementById(formId).elements;

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];

                if (element.tagName == "INPUT"){
                    element.focus();
                    break;
                }
            }
            
            window.scrollTo(0, 0);
        },
        validate: (event) => {
            const form = event.target;
            const inputs = form.getElementsByTagName("input");

            let validate = validateRequiredInputs(inputs);

            return validate;
        },
    };
};

const form = module();

export { form };