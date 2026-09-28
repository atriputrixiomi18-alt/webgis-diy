let namaWilayah = "Yogyakarta";
let jumlahPenduduk = 20.5;

console.log("Nama Wilayah: " + namaWilayah);
console.log("Jumlah Penduduk: " + jumlahPenduduk + " juta");

Array
let wilayahDIY = ["Sleman", "Bantul", "Gunungkidul", "Kulon Progo", "Yogyakarta"];

console.log(wilayahDIY);
console.log("Kota indeks ke-0: " + wilayahDIY[0]);

function myFunction() {
    console.log("ini adalah function");
    console.log("ini adalah function uji coba");
    console.log("Oke...");
    alert("Halo... Look at me!!!");
}

function callMyName(name, usia) {
    console.log("Halo nama saya " + name);
    console.log("Usia saya " + usia + " tahun");
}
callMyName("Atri", 21);
callMyName("nanda", 22);

let myTombol = document.getElementById('btn-peta');

myTombol.addEventListener('click', function () {
    let myStatus = document.getElementById('status');

    myStatus.textContent = 'Peta telah di tampilkan';

    myStatus.style.color = 'red';

    myStatus.style.backgroundColor = 'white';
});

let map = L.map("map").setView([-7.7956, 110.3695], 10);
let geojsonData = null;
let wilayahLayer = null;
let selectedLayer = null;

let openTopoMap = L.tileLayer(
    "https://tile.opentopomap.org/{z}/{x}/{y}.png",
    {
        attribution:
            'Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy;OpenTopoMap'
    }
).addTo(map);
let openStreetMap = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            'Map data &copy; OpenStreetMap contributors, SRTM | Map style &copy;OpenTopoMap'
    }
).addTo(map);


fetch("data/diy-demografi.geojson")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        geojsonData = data;
        wilayahLayer = L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: feature.properties.stroke, fillColor: feature.properties.fill,
                    weight: 3,
                    fillOpacity: 0.7,
                    opacity: 0.7,
                };
            },
            onEachFeature: function (feature, layer) {
                let popupContent = `
    <div class="popup-content">

        <div
            class="popup-header"
            style="border-left-color: ${feature.properties.fill};"
        >
            <h3>${feature.properties.nama}</h3>
            <span>Informasi Wilayah</span>
        </div>

        <div class="popup-item">
            <span class="popup-label">Jumlah Penduduk</span>
            <strong>${feature.properties.jumlah_penduduk} jiwa</strong>
        </div>

        <div class="popup-item">
            <span class="popup-label">Luas Wilayah</span>
            <strong>${feature.properties.luas_wilayah_km2} km²</strong>
        </div>

        <div class="popup-item">
            <span class="popup-label">Kepadatan Penduduk</span>
            <strong>${feature.properties.kepadatan} jiwa/km²</strong>
        </div>

    </div>
`;
                layer.bindPopup(popupContent);
            },
        }).addTo(map);

        geojsonData.features.forEach(function (feature) {
            let option = document.createElement("option");
            option.value = feature.properties.nama;
            option.textContent = feature.properties.nama;
            wilayahSelect.appendChild(option);
        });
        wilayahSelect.addEventListener("change", function () {
            let selectedName = wilayahSelect.value;
            let selectedFeature = geojsonData.features.find(function (feature) {
                return feature.properties.nama === selectedName;
            });

            if (selectedLayer) {
                map.removeLayer(selectedLayer);
            }

            selectedLayer = L.geoJSON(selectedFeature, {
                style: function (feature) {
                    return {
                        color: feature.properties.stroke,
                        fillColor: feature.properties.fill,
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    };
                },
                onEachFeature: function (feature, layer) {
                    let popupContent = `
    <div class="popup-content">

        <div
            class="popup-header"
            style="border-left-color: ${feature.properties.fill};"
        >
            <h3>${feature.properties.nama}</h3>
            <span>Informasi Wilayah</span>
        </div>

        <div class="popup-item">
            <span class="popup-label">Jumlah Penduduk</span>
            <strong>${feature.properties.jumlah_penduduk} jiwa</strong>
        </div>

        <div class="popup-item">
            <span class="popup-label">Luas Wilayah</span>
            <strong>${feature.properties.luas_wilayah_km2} km²</strong>
        </div>

        <div class="popup-item">
            <span class="popup-label">Kepadatan Penduduk</span>
            <strong>${feature.properties.kepadatan} jiwa/km²</strong>
        </div>

    </div>
`;
                    layer.bindPopup(popupContent);
                },
            }).addTo(map);
            map.fitBounds(selectedLayer.getBounds());
            console.log(selectedFeature);
        });
        let baseMaps = {
            "OpenTopoMap": openTopoMap,
            "Open Street Map": openStreetMap
        };
        let overlayes = {
            "Wilayah Kabupaten/Kota": wilayahLayer,
        };
        L.control.layers(
            baseMaps, overlayes
        ).addTo(map);

    });

let tombolPeta = document.getElementById("btn-peta");
let mapElement = document.getElementById("map");
let mapPlaceholder = document.getElementById("map-placeholder");
let wilayahSelect = document.getElementById("wilayah-select");

