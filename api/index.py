from flask import Flask, render_template, redirect, url_for, send_from_directory, abort
import os

app = Flask(__name__)
app.template_folder = os.path.join(
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..")), "templates"
)


@app.route("/<path:filepath>")
def assets(filepath):
    directory = os.path.dirname(filepath)
    filename = os.path.basename(filepath)
    print(f"Directory: {directory}, Filename: {filename}")
    
    return send_from_directory(os.path.join('..', directory), filename)


@app.route("/<html>.html")
def html_page(html):
    return render_template(f"{html}.html")


@app.route("/")
def index():
    return render_template("index.html", current_page="index")


@app.route("/home")
def rules():
    return render_template("index.html", current_page="home")


@app.route("/shop")
def staff():
    return render_template("html/shop.html", current_page="shop")

@app.route("/cart")
def ranks():
    return render_template("html/cart.html", current_page="ranks")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)