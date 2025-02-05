export default function CommandPlugin() {
    return function install(openmct) {
        openmct.types.addType('command-panel', {
            name: 'Command Panel',
            description: 'Send immediate commands',
            cssClass: 'icon-telemetry',
            creatable: true
        });

        openmct.objectViews.addProvider({
            name: 'Command Panel View',
            key: 'command-panel-view',
            canView: (domainObject) => domainObject.type === 'command-panel',
            view: (domainObject) => {
                return {
                    show(container) {
                        container.innerHTML = `
                            <h2>Send Command</h2>
                            <label>Satellite:
                                <input id="sat-name" type="text" value="ISS" />
                            </label>
                            <label>Command:
                                <input id="cmd-name" type="text" value="STATUS" />
                            </label>
                            <button id="send-btn">Send</button>
                            <div id="status"></div>
                        `;
                        document.getElementById('send-btn').addEventListener('click', () => {
                            const sat = document.getElementById('sat-name').value;
                            const cmd = document.getElementById('cmd-name').value;
                            fetch('/api/send-command', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({ satellite_name: sat, command_name: cmd })
                            })
                            .then(res => res.json())
                            .then(data => {
                                document.getElementById('status').innerHTML = `<p>${data.status}</p>`;
                            })
                            .catch(err => {
                                document.getElementById('status').innerHTML = `<p>Error sending command</p>`;
                            });
                        });
                    },
                    destroy() {}
                };
            }
        });
    };
}
