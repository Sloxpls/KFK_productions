// utility functions to convert status code to label and css class
// Uploaded means uploaded to spotify
// Pending means queued for upload to spotify
// Ready means album is ready to be queued for spotify upload
// Work in progress means album is not yet finished


export const getStatusLabel = (status) => {
	switch (Number(status)) {
			case 1: return "Uploaded";
			case 2: return "Pending";
			case 3: return "Ready";
			case 4: return "Work in progress";
			default: return "Unknown";
	}
};

export const getStatusClass = (status) => `status-${status}`;
