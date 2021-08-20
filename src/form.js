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
      let label = input.previousElementSibling;
      let required = label.className;

      required = required.includes("required");

      if (required && input.value === "") {
        invalids++;
        showFieldError(input, "Por favor, informe o(a) " + label.innerHTML.toLowerCase());
      } else {
        hiddenFieldError(input);
      }
    }

    invalids ? (validate = false) : (validate = true);

    return validate;
  }

  return {
    click: () => {
      document.getElementById("data-add").click();
    },
    focusFirstElement: (formId) => {
      var elements = document.getElementById(formId).elements;

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        if (element.tagName == "INPUT") {
          element.focus();
          break;
        }
      }
    },
    cleanErrors: (formId) => {
      var elements = document.getElementById(formId).elements;

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        hiddenFieldError(element);
      }
    },
    validate: (formId) => {
      var form = document.getElementById(formId);
      const inputs = form.getElementsByTagName("input");

      let validate = validateRequiredInputs(inputs);

      return validate;
    },
  };
};

const form = module();

export { form };
