window.onload = async function () {
  try {
    let response = await fetch("https://api.ipify.org?format=json");
    let data = await response.json();
    // document.getElementById("ip-address").textContent = data.ip;

    console.log("page Loaded", {
      event: "page Loaded",
      timeStamp: new Date().valueOf(),
      ip: data.ip,
    });
  } catch (error) {
    console.log("IP ERROR", error);
  }
};
//scroll event
window.addEventListener("scroll", function () {
  try {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / documentHeight) * 100;
    if (
      Math.round(scrollPercentage) === 25 ||
      Math.round(scrollPercentage) === 50 ||
      Math.round(scrollPercentage) === 75 ||
      Math.round(scrollPercentage) === 100
    ) {
      console.log("Scroll Percentage:", {
        event: "Page Scroll",
        percentage: Math.round(scrollPercentage),
        timeStamp: new Date().valueOf(),
      });
    }
  } catch (error) {
    console.log("scroll", error);
  }
});

//click event detect button click and link click

document.addEventListener("click", (e) => {
  try {
    // console.log("Button clicked:", e.target.innerText, e.target);

    if (e.target.tagName === "BUTTON") {
      // Handle the button click event here
      // console.log('Button clicked:', e.target.innerText);
      console.log("clicked", {
        event: "clicked",
        element: "BUTTON",
        timeStamp: new Date().valueOf(),
        action: e.target.innerText ? e.target.innerText : e.target.innerHTML,
      });
    }

    if (e.target.tagName.toUpperCase() === "A") {
      // Handle the link click event here
      // console.log('link clicked:', e.target);
      console.log("clicked", {
        event: "clicked",
        element: "LINK",
        timeStamp: new Date().valueOf(),
        action: e.target.innerText ? e.target.innerText : e.target.innerHTML,
      });
    }
  } catch (error) {
    console.log("click event", error);
  }
});

//form submission
document.addEventListener("submit", function (e) {
  try {
    e.preventDefault(); //stop page from rerender

    if (e.target) {
      const data = new FormData(e.target);
      let formData = [...data.entries()];
      // let val = e.target.getAttribute('shippingForm')
      // listAttributes()
      // let val = e.target.dataset
      // console.log("@@@@", e.target[0].value)

      let packet = {};
      console.log("SUBMIT**************", {
        event: "submit",
        timeStamp: new Date().valueOf(),
        formData: formData.length !== 0 ? formData : packet,
      });
      for (let i = 0; i < e.target.length; i++) {
        let ele = e.target[i];
        console.log(`${ele.name ? ele.name : ele.placeholder}: ${ele.value}\n`);
        packet[
          ele.name ? ele.name : ele.placeholder ? ele.placeholder : makeid(6)
        ] = ele.value ? ele.value : null;
      }

      console.log("SUBMIT**************", {
        event: "submit",
        timeStamp: new Date().valueOf(),
        formData: formData.length !== 0 ? formData : packet,
      });
    }
  } catch (error) {
    console.log("form submission event", error);
  }
});

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// function listAttributes() {
// const form = document.getElementById("shippingForm");

// if (form.hasAttributes()) {
//   let output = "Attributes of first paragraph:\n";
//   for (const attr of form.attributes) {
//     output += `${attr.name} -> ${attr.value}\n`;
//   }
//   console, log("@ATTRIBUTES", output)
// } else {
//   result.textContent = "No attributes to show";
// }
// }
