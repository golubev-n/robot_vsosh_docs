from PIL import Image
im = Image.open("logo.png")
im = im.convert("RGB")
im.thumbnail((355, 50), Image.LANCZOS)  # вписать в 1200x1200
im.save("logo2.png", quality=85, optimize=True)
