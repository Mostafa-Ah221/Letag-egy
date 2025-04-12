import { useContext, useEffect, useState, useRef } from "react";
import { MapPin, Navigation, Search } from "lucide-react";
import { useLanguage } from "../../context/LanguageContextPro";
import axios from "axios";
import { ContextData } from "../../context/ContextApis";
import { Link, useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, StandaloneSearchBox } from "@react-google-maps/api";

const LocationMapComponent = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { language } = useLanguage();
  const { api_key, map_key, setCityData } = useContext(ContextData);
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const [requestKey, setRequestKey] = useState(0);
  const [tempCityData, setTempCityData] = useState(null);
  const navigate = useNavigate();

  const mapContainerStyle = {
    height: "400px",
    width: "100%"
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const fetchCityData = async (lat, lng) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        "https://tarshulah.com/api/city/get",
        { lat, lng },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            APP_KEY: api_key,
          },
        }
      );

      if (response?.data && response?.data?.data) {
        setTempCityData(response.data.data);
        setError(null);
      } 
    } catch (error) {
      console.error("Error fetching city data:", error);
      
      if (error?.response?.data?.data?.message) {
        setError(error.response.data.data.message);
      } else if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error?.message) {
        setError(error.message);
      } else {
        setError(language === "ar" ? "حدث خطأ غير معروف" : "An unknown error occurred");
      }
    } finally {
      setLoading(false);
      setRequestKey(prevKey => prevKey + 1);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          fetchCityData(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            language === "ar"
              ? "حدث خطأ أثناء تحديد الموقع"
              : "An error occurred while determining location"
          );
        }
      );
    } else {
      setError(
        language === "ar"
          ? "المتصفح لا يدعم تحديد الموقع"
          : "Browser does not support geolocation"
      );
    }
  }, [language]);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setTempCityData(null);
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          fetchCityData(latitude, longitude);
          if (mapRef.current) {
            mapRef.current.panTo({ lat: latitude, lng: longitude });
            mapRef.current.setZoom(13);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            language === "ar"
              ? "حدث خطأ أثناء تحديد الموقع"
              : "An error occurred while determining location"
          );
        }
      );
    }
  };

  const handleMapClick = (e) => {
    setTempCityData(null);
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setLocation(newLocation);
    fetchCityData(newLocation.lat, newLocation.lng);
  };

  const handlePlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: place.name
        };
        
        setTempCityData(null);
        setLocation(newLocation);
        fetchCityData(newLocation.lat, newLocation.lng);
        
        if (mapRef.current) {
          mapRef.current.panTo(newLocation);
          mapRef.current.setZoom(13);
        }
      }
    }
  };

  const activateSearch = () => {
    setIsSearchActive(true);
    
    setTimeout(() => {
      const searchInput = document.querySelector(".pac-container input");
      if (searchInput) {
        searchInput.focus();
      }
    }, 100);
  };

  const handleSubmit = () => {
    setCityData(tempCityData || null);
    navigate("/home");
  };

  const MapWithSearch = () => {
    return (
      <LoadScript
        googleMapsApiKey={map_key}
        libraries={["places"]}
      >
        <div style={{ position: "relative", width: "100%", height: "400px" }}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={location}
            zoom={13}
            options={options}
            onClick={handleMapClick}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            {location && (
              <Marker
                position={location}
                title={language === "ar" ? "الموقع المحدد" : "Selected location"}
              />
            )}
            
            {isSearchActive && (
              <StandaloneSearchBox
                onLoad={(ref) => {
                  searchBoxRef.current = ref;
                }}
                onPlacesChanged={handlePlacesChanged}
              >
                <input
                  type="text"
                  placeholder={language === "ar" ? "ابحث عن موقع..." : "Search for a location..."}
                  style={{
                    boxSizing: "border-box",
                    border: "1px solid transparent",
                    width: "240px",
                    height: "40px",
                    padding: "0 12px",
                    borderRadius: "3px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                    fontSize: "14px",
                    outline: "none",
                    textOverflow: "ellipses",
                    position: "absolute",
                    left: "50%",
                    marginLeft: "-120px",
                    top: "10px",
                    backgroundColor: "white"
                  }}
                />
              </StandaloneSearchBox>
            )}
          </GoogleMap>
        </div>
      </LoadScript>
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-2xl mx-auto my-8">
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center">
          <MapPin className="mr-2" />
          {language === "ar" ? "تحديد الموقع" : "Location"}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={activateSearch}
            className="bg-white text-blue-600 px-4 py-2 rounded-full flex items-center hover:bg-gray-100 transition-colors mr-2"
            aria-label={language === "ar" ? "البحث عن موقع" : "Search for location"}
          >
            <Search className="mr-2" size={20} />
            {language === "ar" ? "بحث" : "Search"}
          </button>
          <button
            onClick={getCurrentLocation}
            className="bg-white text-blue-600 px-4 py-2 rounded-full flex items-center hover:bg-gray-100 transition-colors"
            aria-label={language === "ar" ? "تحديد موقعي الحالي" : "Get my current location"}
          >
            <Navigation className="mr-2" size={20} />
            {language === "ar" ? "موقعي الحالي" : "My Location"}
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gray-100 rounded-lg overflow-hidden shadow-inner">
          {location ? (
            <MapWithSearch />
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p className="text-center text-gray-500">
                {language === "ar"
                  ? "لم يتم تحديد موقع بعد. استخدم البحث أو انقر على الخريطة."
                  : "No location selected yet. Use the search or click on the map."}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-blue-600">
          {language === "ar" 
            ? "انقر على أي مكان في الخريطة لتحديد موقع مخصص" 
            : "Click anywhere on the map to select a custom location"}
        </div>

        {loading && (
          <div className="mt-4 text-center">
            <p className="text-blue-600">
              {language === "ar" ? "جاري جلب بيانات المدينة..." : "Fetching city data..."}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {tempCityData && (
          <div className="mt-4" key={requestKey}>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold text-blue-800 mb-2">
                {language === "ar" ? "بيانات المدينة" : "City Data"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {language === "ar" ? "معرف المدينة" : "City ID"}
                  </p>
                  <p className="font-bold text-blue-800">{tempCityData.city_id}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {location && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                {language === "ar" ? "خط العرض" : "Latitude"}
              </p>
              <p className="font-bold text-blue-800">
                {location.lat.toFixed(6)}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                {language === "ar" ? "خط الطول" : "Longitude"}
              </p>
              <p className="font-bold text-blue-800">
                {location.lng.toFixed(6)}
              </p>
            </div>
          </div>
        )}
      </div>
      <Link to="stock" className="bg-blue-200 p-3 rounded-lg mb-3 mx-auto block w-48 text-center hover:bg-blue-300 duration-200">
        {language === "ar" ? " موقع المخازن" : "Warehouse Location"}
      </Link>
      <button 
        onClick={handleSubmit} 
        className="bg-blue-600 text-white p-3 rounded-lg mb-3 mx-auto block w-48 text-center hover:bg-blue-700 duration-200">
        {language === "ar" ? "تسجيل" : "Submit"}
      </button>
    </div>
  );
};

export default LocationMapComponent;