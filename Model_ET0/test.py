import streamlit as st

class StreamlitGeolocation:
    def __init__(self):
        # Display a button to simulate geolocation retrieval
        self.button_pressed = st.button("Simulate Geolocation Retrieval")

        # Use JavaScript to trigger the button click and retrieve geolocation
        if self.button_pressed:
            self.inject_js()

        # Display the geolocation data
        self.geolocation_result = st.session_state.get("coords")

        if self.geolocation_result:
            st.write("Geolocation Data:")
            st.write(f"Latitude: {self.geolocation_result['latitude']}")
            st.write(f"Longitude: {self.geolocation_result['longitude']}")
            st.write(f"Altitude: {self.geolocation_result['altitude']}")
            st.write(f"Accuracy: {self.geolocation_result['accuracy']}")
            st.write(f"Altitude Accuracy: {self.geolocation_result['altitudeAccuracy']}")
            st.write(f"Heading: {self.geolocation_result['heading']}")
            st.write(f"Speed: {self.geolocation_result['speed']}")
        else:
            st.write("Waiting for geolocation data...")

    def inject_js(self):
        script = """
            document.addEventListener("DOMContentLoaded", function() {
                const button = document.querySelector('.streamlit-geolocation button');
                if (button) {
                    button.click();
                }
            });
        """
        st.components.v1.html(f"<script>{script}</script>", height=0)


if __name__ == "__main__":
    streamlit_geolocation = StreamlitGeolocation()
