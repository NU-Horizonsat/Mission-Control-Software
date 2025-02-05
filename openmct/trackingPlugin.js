export default function TrackingPlugin() {
    return function install(openmct) {
        openmct.types.addType('tracking-panel', {
            name: 'Antenna Tracking Panel',
            description: 'Send rotor angles to GreenCTLD',
            cssClass: 'icon-track',
            creatable: true
        });

        openmct.objectViews.addProvider({
            name: 'Tracking Panel View',
            key: 'tracking-panel-view',
            canView: (domainObject) => domainObject.type === 'tracking-panel',
            view: (domainObject) => {
                return {
                    show(container) {
                        container.innerHTML = `
                            <h2>Antenna Position</h2>
                            <label>Satellite:
                                <input id="sat-name" type="text" value="ISS" />
                            </label>
                            <label>Azimuth:
                                <input id="az" type="number" value="120.0" step="0.1"/>
                            </label>
                            <label>Elevation:
                                <input id="el" type="number" value="45.0" step="0.1"/>
                            </label>
                            <button id="track-btn">Track</button>
                            <div id="track-status"></div>
                        `;
                        document.getElementById('track-btn').addEventListener('click', () => {
                            const sat = document.getElementById('sat-name').value;
                            const az = parseFloat(document.getElementById('az').value);
                            const el = parseFloat(document.getElementById('el').value);
                            fetch('/api/track-satellite', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({
                                    satellite_name: sat,
                                    azimuth: az,
                                    elevation: el
                                })
                            })
                            .then(res => res.json())
                            .then(data => {
                                document.getElementById('track-status')
                                    .innerHTML = `<p>${data.status}: ${data.azimuth} / ${data.elevation}</p>`;
                            })
                            .catch(err => {
                                document.getElementById('track-status').innerHTML = `<p>Error tracking</p>`;
                            });
                        });
                    },
                    destroy() {}
                };
            }
        });
    };
}
