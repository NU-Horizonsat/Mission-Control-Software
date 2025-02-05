export default function SchedulerPlugin() {
    return function install(openmct) {
        openmct.types.addType('scheduler-panel', {
            name: 'Scheduler Panel',
            description: 'Schedule commands for future execution',
            cssClass: 'icon-clock',
            creatable: true
        });

        openmct.objectViews.addProvider({
            name: 'Scheduler Panel View',
            key: 'scheduler-panel-view',
            canView: (domainObject) => domainObject.type === 'scheduler-panel',
            view: (domainObject) => {
                return {
                    show(container) {
                        container.innerHTML = `
                            <h2>Schedule Command</h2>
                            <label>Satellite:
                                <input id="sat-name" type="text" value="ISS" />
                            </label>
                            <label>Command:
                                <input id="cmd-name" type="text" value="STATUS" />
                            </label>
                            <label>Execution Time (RFC3339):
                                <input id="exec-time" type="text" value="2025-02-01T12:00:00Z" />
                            </label>
                            <button id="schedule-btn">Schedule</button>
                            <div id="schedule-status"></div>
                        `;
                        document.getElementById('schedule-btn').addEventListener('click', () => {
                            const sat = document.getElementById('sat-name').value;
                            const cmd = document.getElementById('cmd-name').value;
                            const time = document.getElementById('exec-time').value;
                            fetch('/api/schedule-command', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify({
                                    satellite_name: sat,
                                    command_name: cmd,
                                    execution_time: time
                                })
                            })
                            .then(res => res.json())
                            .then(data => {
                                document.getElementById('schedule-status')
                                    .innerHTML = `<p>${data.status} at ${data.execution_time}</p>`;
                            })
                            .catch(err => {
                                document.getElementById('schedule-status').innerHTML = `<p>Error scheduling</p>`;
                            });
                        });
                    },
                    destroy() {}
                };
            }
        });
    };
}
