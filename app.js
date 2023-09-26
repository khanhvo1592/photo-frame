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

    // Hàm để tải ảnh mặc định
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

            // Hiển thị liên kết tải về
            downloadLink.href = canvas.toDataURL();
            downloadLink.style.display = "block";
        };
    }

    // Sự kiện lắng nghe cho các input thay đổi
    scaleInput.addEventListener("input", updatePreview);
    rotateInput.addEventListener("input", updatePreview);
    xPositionInput.addEventListener("input", updatePreview);
    yPositionInput.addEventListener("input", updatePreview);

    // Gọi hàm để tải ảnh mặc định khi trang web được tải
    loadDefaultImage();

    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                userImage.src = e.target.result;
                updatePreview(); // Tự động cập nhật xem trước khi tải lên.
            };
            reader.readAsDataURL(file);
        }
    });

    // Hàm cập nhật xem trước
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
            // Dùng transformations để xoay và vẽ hình ảnh
            ctx.save(); // Lưu trạng thái hiện tại của canvas
            ctx.translate(canvas.width / 2, canvas.height / 2); // Di chuyển vị trí gốc của hình ảnh vào giữa canvas
            ctx.rotate((rotate * Math.PI) / 180); // Xoay hình ảnh (đổi độ sang radian)
            ctx.drawImage(
                userImageElement,
                (-userImageElement.width * scale) / 2 + xPosition,
                (-userImageElement.height * scale) / 2 + yPosition,
                userImageElement.width * scale,
                userImageElement.height * scale
            );
            ctx.restore(); // Khôi phục trạng thái trước đó của canvas

            ctx.drawImage(frame, 0, 0, frame.width, frame.height);

            resultImage.src = canvas.toDataURL();
            resultImage.style.display = "block";

            // Hiển thị liên kết tải về
            downloadLink.style.display = "block";
            downloadLink.addEventListener("click", () => {
                downloadLink.href = canvas.toDataURL();
                downloadLink.download = "image.png"; // Đặt tên tệp tải về ở đây.
            });
        };
    }
});
