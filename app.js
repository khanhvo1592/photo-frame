document.addEventListener("DOMContentLoaded", function () {
    const imageInput = document.getElementById("imageInput");
    const canvas = document.getElementById("canvas");
    const resultImage = document.getElementById("resultImage");
    const downloadLink = document.getElementById("downloadLink");
    const adjustControls = document.getElementById("adjustControls");
    const scaleInput = document.getElementById("scale");
    const rotateInput = document.getElementById("rotate");
    const xPositionInput = document.getElementById("xPosition");
    const yPositionInput = document.getElementById("yPosition");
    const userImage = document.getElementById("userImage");
    const frame = new Image();
    const increaseScaleButton = document.getElementById("increaseScale");
    const decreaseScaleButton = document.getElementById("decreaseScale");

    // Function to load the default image
    function loadDefaultImage() {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        frame.src = "frames/frame.png";

        frame.onload = () => {
            canvas.width = frame.width;
            canvas.height = frame.height;

            ctx.drawImage(frame, 0, 0, frame.width, frame.height);

            resultImage.src = canvas.toDataURL();
            resultImage.style.display = "block";

            // Display the download link
            downloadLink.href = canvas.toDataURL();
            downloadLink.style.display = "block";
        };
    }

    // Event listeners for input changes
    scaleInput.addEventListener("input", updatePreview);
    rotateInput.addEventListener("input", updatePreview);
    xPositionInput.addEventListener("input", updatePreview);
    yPositionInput.addEventListener("input", updatePreview);

    // Event listeners for scale adjustment buttons
    increaseScaleButton.addEventListener("click", increaseScale);
    decreaseScaleButton.addEventListener("click", decreaseScale);

    // Load the default image when the page loads
    loadDefaultImage();

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                userImage.src = e.target.result;
                updatePreview(); // Automatically update the preview upon upload.
            };
            reader.readAsDataURL(file);
        }
    });

    // Function to update the preview
    function updatePreview() {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scale = parseFloat(scaleInput.value);
        const rotate = parseInt(rotateInput.value);
        const xPosition = parseInt(xPositionInput.value);
        const yPosition = parseInt(yPositionInput.value);

        const userImageElement = new Image();
        userImageElement.src = userImage.src;
        userImageElement.onload = () => {
            // Use transformations to rotate and draw the image
            ctx.save(); // Save the current state of the canvas
            ctx.translate(canvas.width / 2, canvas.height / 2); // Move the origin of the image to the center of the canvas
            ctx.rotate((rotate * Math.PI) / 180); // Rotate the image (convert degrees to radians)
            ctx.drawImage(
                userImageElement,
                (-userImageElement.width * scale) / 2 + xPosition,
                (-userImageElement.height * scale) / 2 + yPosition,
                userImageElement.width * scale,
                userImageElement.height * scale
            );
            ctx.restore(); // Restore the previous state of the canvas

            ctx.drawImage(frame, 0, 0, frame.width, frame.height);

            resultImage.src = canvas.toDataURL();
            resultImage.style.display = "block";

            // Display the download link
            downloadLink.style.display = "block";
            downloadLink.addEventListener("click", () => {
                downloadLink.href = canvas.toDataURL();
                downloadLink.download = "image.png"; // Set the filename to download here.
            });
        };
    }

    // Function to increase the scale
    function increaseScale() {
        const currentScale = parseFloat(scaleInput.value);
        const newScale = Math.min(currentScale + 0.1, 3); // Increase by 0.1, but limit to a maximum of 3
        scaleInput.value = newScale;
        updatePreview();
    }

    // Function to decrease the scale
    function decreaseScale() {
        const currentScale = parseFloat(scaleInput.value);
        const newScale = Math.max(currentScale - 0.1, 0.1); // Decrease by 0.1, but limit to a minimum of 0.1
        scaleInput.value = newScale;
        updatePreview();
    }
});
