package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"time"

	"github.com/gorilla/mux"
)

// Satellite represents a single satellite config
type Satellite struct {
	Name      string   `json:"name"`
	NoradID   int      `json:"norad_id"`
	Frequency float64  `json:"frequency"`
	Commands  []string `json:"commands"`
}

// Config holds the entire JSON configuration (list of satellites, etc.)
type Config struct {
	Satellites []Satellite `json:"satellites"`
}

// Global config
var config Config

func main() {
	// Load satellites.json
	if err := loadConfig("config/satellites.json"); err != nil {
		log.Fatalf("Failed to load satellites config: %v", err)
	}

	r := mux.NewRouter()

	// Endpoints
	r.HandleFunc("/api/send-command", handleSendCommand).Methods("POST")
	r.HandleFunc("/api/schedule-command", handleScheduleCommand).Methods("POST")
	r.HandleFunc("/api/track-satellite", handleTrackSatellite).Methods("POST")
	r.HandleFunc("/api/predict-passes", handlePredictPasses).Methods("GET")

	httpAddr := ":8081"
	fmt.Printf("Go Mission Control listening on %s...\n", httpAddr)
	log.Fatal(http.ListenAndServe(httpAddr, r))
}

// loadConfig reads satellites.json
func loadConfig(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, &config)
}

// handleSendCommand sends a command to AIT for immediate uplink
func handleSendCommand(w http.ResponseWriter, r *http.Request) {
	type reqBody struct {
		SatelliteName string `json:"satellite_name"`
		CommandName   string `json:"command_name"`
	}

	var body reqBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Example: just call a Python script in the AIT container using Docker CLI,
	// or post to AIT's own server if AIT is listening.
	cmdString := fmt.Sprintf("docker exec ait python3 /scripts/command_handler.py %s %s",
		body.SatelliteName, body.CommandName)
	if err := execCmd(cmdString); err != nil {
		http.Error(w, "Command execution error", http.StatusInternalServerError)
		return
	}

	resp := map[string]string{"status": "Command sent"}
	json.NewEncoder(w).Encode(resp)
}

// handleScheduleCommand schedules a command for future execution
func handleScheduleCommand(w http.ResponseWriter, r *http.Request) {
	type reqBody struct {
		SatelliteName string `json:"satellite_name"`
		CommandName   string `json:"command_name"`
		ExecutionTime string `json:"execution_time"`
	}

	var body reqBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	t, err := time.Parse(time.RFC3339, body.ExecutionTime)
	if err != nil {
		http.Error(w, "Invalid execution_time format, use RFC3339", http.StatusBadRequest)
		return
	}

	// Basic scheduling approach: use 'at' command in the container host or a cron approach.
	// Or store these in memory and run a background scheduler (like a goroutine).
	cmdString := fmt.Sprintf("echo \"docker exec ait python3 /scripts/command_handler.py %s %s\" | at %s",
		body.SatelliteName, body.CommandName, t.Format("15:04")) // simplistic example

	if err := execCmd(cmdString); err != nil {
		http.Error(w, "Failed to schedule command", http.StatusInternalServerError)
		return
	}

	resp := map[string]string{"status": "Command scheduled", "execution_time": t.String()}
	json.NewEncoder(w).Encode(resp)
}

// handleTrackSatellite sends rotor positions to greenctld
func handleTrackSatellite(w http.ResponseWriter, r *http.Request) {
	type reqBody struct {
		SatelliteName string  `json:"satellite_name"`
		Azimuth       float64 `json:"azimuth"`
		Elevation     float64 `json:"elevation"`
	}

	var body reqBody
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// greenctld is listening on port 4533. We can emulate rotctld netcat approach:
	// "P <az> <el>"
	rotorCmd := fmt.Sprintf("echo \"P %.2f %.2f\" | nc localhost 4533", body.Azimuth, body.Elevation)
	if err := execCmd(rotorCmd); err != nil {
		http.Error(w, "Failed to track satellite", http.StatusInternalServerError)
		return
	}

	resp := map[string]string{
		"status":    "Tracking started",
		"satellite": body.SatelliteName,
		"azimuth":   fmt.Sprintf("%.2f", body.Azimuth),
		"elevation": fmt.Sprintf("%.2f", body.Elevation),
	}
	json.NewEncoder(w).Encode(resp)
}

// handlePredictPasses uses a TLE-based approach or external library (in Python or Go).
func handlePredictPasses(w http.ResponseWriter, r *http.Request) {
	satelliteName := r.URL.Query().Get("satellite")
	if satelliteName == "" {
		http.Error(w, "satellite query param required", http.StatusBadRequest)
		return
	}

	// This is just a stub. In practice, you'd parse TLE from e.g. Celestrak,
	// run a library, and compute next passes. For demonstration:
	passes := []map[string]string{
		{"start": "2025-02-10T08:00:00Z", "end": "2025-02-10T08:10:00Z"},
		{"start": "2025-02-10T10:00:00Z", "end": "2025-02-10T10:05:00Z"},
	}
	resp := map[string]interface{}{
		"satellite": satelliteName,
		"passes":    passes,
	}
	json.NewEncoder(w).Encode(resp)
}

// Utility to run shell commands
func execCmd(cmdString string) error {
	log.Printf("Exec cmd: %s", cmdString)
	cmd := exec.Command("bash", "-c", cmdString)
	out, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("Error output: %s", string(out))
		return err
	}
	return nil
}
