"use client";
import React, { FormEvent, useState, useRef } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Button,
  TextField,
  FormControl,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  createTheme,
  ThemeProvider,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import optimization from "@/public/jsonData/optimization_goals.json";
import billingEvents from "@/public/jsonData/billing_event.json";
import {
  AdTargetingCategory,
  AdsetPayload,
  Cities,
  GeoLocation,
  Interest,
  LocationData,
} from "../../_models/adAccount.model";
import {
  CreateAdsetService,
  GetCitySearchData,
  GetIndustrySearchData,
  GetInterestsSearchData,
} from "../../_services/adAccountService";
import { Toast } from "primereact/toast";

interface AdSetProps {
  campaign: string;
  objective: string;
}
const AdsetForm: React.FC<AdSetProps> = ({ campaign, objective }) => {
  const [adsetName, setAdsetName] = useState("");
  const [optimizationGoal, setOptimizationGoal] = useState("");
  const [billingEvent, setBillingEvent] = useState("");
  const [bidAmount, setBidAmount] = useState(0);
  const [dailyBudget, setDailyBudget] = useState(0);
  const [geolocations, setGeolocations] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  const [cities, setCities] = useState("");
  const [industries, setIndustries] = useState("");
  const [interests, setInterests] = useState("");
  const [startTime, setStartTime] = useState("");

  const [interestsSearchData, setInterestsSearchData] = useState<Interest[]>(
    []
  );
  const [citySearchData, setCitySearchData] = useState<LocationData[]>([]);
  const [industrySearchData, setIndustrySearchData] = useState<
    AdTargetingCategory[]
  >([]);

  const [returnInterestsData, setReturnInterestsData] = useState<string[]>([]);
  const [returnCityData, setReturnCityData] = useState<string[]>([]);
  const [returnIndustryData, setReturnIndustryData] = useState<string[]>([]);

  const toast = useRef<Toast>(null);

  const showSuccessToast = (message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };

  const showErrorToast = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error Message",
      detail: message,
      life: 3000,
    });
  };

  const handleNextClick = async (e: FormEvent) => {
    e.preventDefault();
    //city
    var tempCity = citySearchData.filter((x) => returnCityData.includes(x.key));
    var geoCity: Cities[] = [];
    tempCity.forEach((x) => {
      var city: Cities = {
        key: x.key,
      };
      geoCity.push(city);
    });
    const geo: GeoLocation = {
      cities: geoCity,
    };
    //interest
    var tempInterest = interestsSearchData.filter((x) =>
      returnInterestsData.map((x) => parseInt(x)).includes(x.id)
    );
    //industry
    var tempIndustry = industrySearchData.filter((x) =>
      returnIndustryData.includes(x.id)
    );
    var industry: Interest[] = [];
    tempIndustry.forEach((x) => {
      var temp: Interest = {
        id: parseInt(x.id),
        name: x.name,
      };
      industry.push(temp);
    });

    const accessTokenfb = localStorage?.getItem("accesstoken_fb") ?? "";
    const adaccountId = localStorage?.getItem("adAccountId") ?? "";
    //"message": "(#100) billing_event must be one of the following values: APP_INSTALLS, CLICKS, IMPRESSIONS, LINK_CLICKS, NONE, OFFER_CLAIMS, PAGE_LIKES, POST_ENGAGEMENT, THRUPLAY, PURCHASE, LISTING_INTERACTION",
    //Billing event invalid for optimisation goal",
    //"error_user_msg": "The specified billing event is not a valid option for the optimisation goal provided. If you are modifying the optimisation goal, please make sure that your billing event will still be consistent with your new optimisation goal.",
    const tempAdSetData: AdsetPayload = {
      adAccountId: adaccountId.toString(),
      campaignId: campaign,
      adsetName,
      optimizationGoal,
      billingEvent,
      bidAmount,
      dailyBudget,
      geolocations: geo,
      industries: industry,
      interests: tempInterest,
      startTime,
      status,
      accessToken: accessTokenfb,
    };
    console.log(tempAdSetData);

    try {
      const response = await CreateAdsetService(tempAdSetData);
      if (response.statusCode == "200") {
        showSuccessToast(response.message);
      }
      setAdsetName("");
      setOptimizationGoal("");
      setBillingEvent("");
      setBidAmount(0),
        setDailyBudget(0),
        setGeolocations([]),
        setIndustries("");
      setInterests(""), setStartTime(""), setStatus("");
      setReturnIndustryData([]);
      setReturnInterestsData([]);
      setReturnCityData([]);
    } catch (error) {
      showErrorToast("Could not create adset");
      console.error(error);
    }
  };

  const getAvailableInterestsData = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const accessTokenfb = localStorage?.getItem("accesstoken_fb") ?? "";
      const response = await GetInterestsSearchData(interests, accessTokenfb);
      if (response.statusCode == "200") {
        setInterestsSearchData(response.responseData);
        showSuccessToast(response.message);
      }
    } catch (error) {
      showErrorToast("Error searching interests");
    }
  };

  const getAvailableCityData = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const accessTokenfb = localStorage?.getItem("accesstoken_fb") ?? "";
      const response = await GetCitySearchData(cities, accessTokenfb);
      if (response.statusCode === "200") {
        setCitySearchData(response.responseData);
        showSuccessToast(response.message);
      }
    } catch (error) {
      showErrorToast("Error searching cities");
    }
  };

  const getAvailableIndustryData = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const accessTokenfb = localStorage?.getItem("accesstoken_fb") ?? "";
      const response = await GetIndustrySearchData(accessTokenfb);
      if (response.statusCode == "200") {
        showSuccessToast(response.message);
        setIndustrySearchData(response.responseData);
        showSuccessToast(response.message);
      }
    } catch (error) {
      showErrorToast("Error searching industries");
    }
  };

  const handleIndustrySearchData = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    if (Array.isArray(value)) {
      // console.log(value)
      setReturnIndustryData(value);
    }
  };

  const handleCitySearchData = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    if (Array.isArray(value)) {
      // console.log(value)
      setReturnCityData(value);
    }
  };

  const handleInterestsSearchData = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    if (Array.isArray(value)) {
      // console.log(value)
      setReturnInterestsData(value);
    }
  };

  const defaultTheme = createTheme({
    typography: {
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    },
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            width: "100%",
            boxShadow: "0 3px 6px rgba(0, 0, 0, 0.16)",
            borderRadius: "8px",
            "& .MuiInputLabel-root": {
              transform: "translateY(50%)",
            },
          },
          input: {
            borderRadius: "50%",
            height: "15px",
          },
        },
      },
      // MuiSelect: {
      //   styleOverrides: {
      //     select: {
      //       height: "13px",
      //     },
      // }
      // }
    },
  });

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Typography
          component="h2"
          sx={{ fontWeight: 700, color: "#272144", textAlign: "left", mb: 2 }}
        >
          Create a new Adset
        </Typography>

        <Grid 
        container spacing={2} columns={12}
        >
          <Grid item sm={12} md={4} lg={4} xs={12}>
            <Box
              component="form"
              onSubmit={getAvailableInterestsData}
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography sx={{ fontWeight: 600, alignContent: "center" }}>
                Search available interests
              </Typography>
              <TextField
                size="small"
                margin="dense"
                required
                type="text"
                variant="outlined"
                placeholder="Search Interests"
                autoFocus
                autoComplete="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
              <IconButton type="submit" aria-label="search">
                <SearchIcon style={{ fill: "blue", alignContent: "center" }} />
              </IconButton>
            </Box>

            <Box
              component="form"
              onSubmit={getAvailableCityData}
              sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography sx={{ fontWeight: 600, alignContent: "center" }}>
                Search available cities
              </Typography>
              <TextField
                size="small"
                margin="dense"
                required
                type="text"
                placeholder="Search Cities"
                variant="outlined"
                autoFocus
                autoComplete="cities"
                value={cities}
                onChange={(e) => setCities(e.target.value)}
              />
              <IconButton type="submit" aria-label="search">
              <SearchIcon style={{ fill: "blue", alignContent: "center" }} />
              </IconButton>
            </Box>

            <Box
              component="form"
              onSubmit={getAvailableIndustryData}
              sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography sx={{ fontWeight: 600, alignContent: "center" }}>
                Search available industries
              </Typography>
              <TextField
                size="small"
                margin="dense"
                required
                type="text"
                variant="outlined"
                autoFocus
                placeholder="Search Industries"
                autoComplete="industries"
                value={industries}
                onChange={(e) => setIndustries(e.target.value)}
              />
              <IconButton type="submit" aria-label="search">
              <SearchIcon style={{ fill: "blue", alignContent: "center" }} />
              </IconButton>
            </Box>          
          </Grid>

          <Grid item sm={12} md={8} lg={8} xs={12}>
            <Box>
              <Grid container spacing={2} columns={8}>
                <Grid item  sm={12} md={4} lg={4} xs={12}> 
                {/* //xs={4}  */}
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, alignContent: "center" }}
                    >
                      Adset Name
                    </Typography>
                    <TextField
                      size="small"
                      margin="dense"
                      required
                      type="text"
                      variant="outlined"
                      autoFocus
                      autoComplete="adsetName"
                      value={adsetName}
                      onChange={(e) => setAdsetName(e.target.value)}
                    />
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, alignContent: "center" }}
                    >
                      Optimization Goal
                    </Typography>
                    <FormControl variant="outlined" margin="dense"
                     sx={{ width: "50%"}}>
                      <Select
                        value={optimizationGoal}
                        onChange={(e) => setOptimizationGoal(e.target.value)}
                        sx={{ height: "32px" }}
                      >
                        {optimization
                          .find((obj) => obj.codeWord === objective)
                          ?.["optimizationGoal"].map((goal, index) => (
                            <MenuItem key={index} value={goal.codeWord}>
                              {goal.codeWord} - {goal.description}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, alignContent: "center" }}
                    >
                      Billing Event
                    </Typography>
                    <FormControl variant="outlined" margin="dense"
                     sx={{ width: "50%"}}>
                      <Select
                        value={billingEvent}
                        onChange={(e) => setBillingEvent(e.target.value)}
                        sx={{ height: "32px" }}
                      >
                        {billingEvents.map((obj, id) => (
                          <MenuItem key={id} value={obj.codeWord}>
                            {obj.codeWord} - {obj.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, alignContent: "center" }}
                    >
                      Bid Amount
                    </Typography>
                    <TextField
                      size="small"
                      margin="dense"
                      required
                      type="number"
                      variant="outlined"
                      autoFocus
                      autoComplete="bidAmount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                    />
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, alignContent: "center" }}
                    >
                      {" "}
                      Daily Budget
                    </Typography>
                    <TextField
                      size="small"
                      margin="dense"
                      required
                      type="number"
                      variant="outlined"
                      autoFocus
                      autoComplete="dailyBudget"
                      value={dailyBudget}
                      onChange={(e) =>
                        setDailyBudget(parseFloat(e.target.value))
                      }
                    />
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, alignContent: "center" }}
                    >
                      Cities
                    </Typography>
                    <FormControl variant="outlined" margin="dense"
                    sx={{ width: "50%"}}>
                     <Select
                        value={returnCityData}
                        onChange={handleCitySearchData}
                        multiple
                        sx={{ height: "32px" }}
                      >
                        {citySearchData.map((obj, id) => (
                          <MenuItem key={id} value={obj.key}>
                            {obj.cityName}, {obj.countryName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item sm={12} md={4} lg={4} xs={12}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, alignContent: "center" }}
                    >
                      Industries
                    </Typography>
                    <FormControl variant="outlined"	margin="dense"
                    sx={{ width: "55%"}}>
                      <Select
                        value={returnIndustryData}
                        onChange={handleIndustrySearchData}
                        multiple
                        sx={{ height: "32px"}}
                        	
                      >
                        {industrySearchData.map((obj, id) => (
                          <MenuItem key={id} value={obj.id}>
                            {obj.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, alignContent: "center" }}
                    >
                      Interests
                    </Typography>
                    <FormControl variant="outlined" margin="dense"
                     sx={{ width: "55%"}}>
                      <Select
                        value={returnInterestsData}
                        onChange={handleInterestsSearchData}
                        multiple
                        sx={{ height: "32px" }}
                      >
                        {interestsSearchData.map((obj, id) => (
                          <MenuItem key={id} value={obj.id}>
                            {obj.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, alignContent: "center" }}
                    >
                      Start Time
                    </Typography>
                    <TextField
                      size="small"
                      margin="dense"
                      required
                      type="datetime-local"
                      variant="outlined"
                      autoFocus
                      autoComplete="startTime"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      sx={{ fontWeight: 600, alignContent: "center" }}
                    >
                      Status
                    </Typography>
                    <FormControl
                      component="fieldset"
                      variant="outlined"
                      margin="dense"
                      size="small"
                    >
                      <RadioGroup
                        row
                        aria-label="status"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        sx={{ justifyContent: "center", height: "15px" }}
                      >
                        <FormControlLabel
                          value="ACTIVE"
                          control={<Radio />}
                          label="Active"
                        />
                        <FormControlLabel
                          value="PAUSED"
                          control={<Radio />}
                          label="Paused"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 8,
                    width: "100%",
                    alignItems: "right",
                    display: "flex",
                    backgroundColor: "#597FB5 !important",
                    color: "#fff !important",
                    "&:hover": {
                      backgroundColor: "#405D80 !important",
                    },
                  }}
                >
                  Create
                </Button>
                </Grid>
              </Grid>
             
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default AdsetForm;
