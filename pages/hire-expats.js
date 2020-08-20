import React, { useReducer, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Anchor,
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Text,
  TextInput,
} from "grommet";

import axios from "axios";
import Head from "next/head";
import BeatLoader from "react-spinners/BeatLoader";

import PopupModal from "../components/Modal";

import JobLocationField from "../components/JobFormComponents/JobLocationField";
import InvoiceAddressField from "../components/JobFormComponents/InvoiceAddressField";
import JobCategoryField from "../components/JobFormComponents/JobCategoryField";
const JobDescriptionField = dynamic(
  () => import("../components/JobFormComponents/JobDescriptionField"),
  { ssr: false }
);

import {
  CardElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = (async () =>
  await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK))();

const API_PATH = process.env.NEXT_PUBLIC_API;

const reducer = (state, action) => {
  let { payload } = action;
  switch (action.type) {
    case "field":
      return { ...state, [payload.name]: payload.value };
    case "object":
      return { ...state, ...payload };
    case "reset":
      return initialState;
    default:
      return state;
  }
};

const cardElementOptions = {
  style: {
    base: {
      color: "#333333",
      fontSize: "18px",
      "::placeholder": {
        color: "#AAAAAA",
      },
    },
    invalid: {
      color: "#FF4040",
      iconColor: "#FF4040",
    },
  },
  disabled: false,
};

const renderPayment = () => (
  <Box width={{ max: "400px" }} pad="small">
    <CardElement options={cardElementOptions} />
  </Box>
);

const SubmitJobForm = ({ size, logEvent }) => {
  const initialState = {
    payment_id: "",
    position: "",
    company: "",
    company_logo: "",
    location: "",
    latLng: {},
    salary: "",
    category: "",
    html_desc:
      "<h4>Description</h4><br><br><h4>Responsibilities</h4><br><br><h4>Requirements</h4>",
    markdown_desc: "",
    application_url: "",
    coupon_code: "",
    client_email: "",
    client_address: "",
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setSuccess] = useState(false);
  const [showError, setError] = useState(false);
  const [cardError, setCardError] = useState(false);

  const {
    position,
    company,
    company_logo,
    location,
    salary,
    category,
    html_desc,
    application_url,
    coupon_code,
    client_email,
    client_address,
  } = state;

  const freePost = coupon_code.toLowerCase() === "freepost2020";

  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "field", payload: { name, value: e.option || value } });
  };

  const handleObject = (obj) => {
    dispatch({ type: "object", payload: { ...obj } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    //
    if (freePost) {
      setIsProcessing(true);
      try {
        const emailPost = await axios.post(`${API_PATH}/emailJobPpost`, {
          data: JSON.stringify({ ...state, payment_id: "freePost2020" }),
        });
        if (emailPost.status === 200) {
          setIsProcessing(false);
          handleObject({ ...initialState });
          // submitted modal
          setSuccess(true);
          logEvent(
            "post-job",
            "success",
            `${company}-${position}-${client_email}`
          );
        }
      } catch (error) {
        setError(true);
        setIsProcessing(false);
        logEvent(
          "post-job",
          "failed",
          `${company}-${position}-${client_email}`
        );
      }

      return;
    }
    setIsProcessing(true);
    const cardElement = elements.getElement(CardElement);

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setCardError(error.message);
      setIsProcessing(false);
      return;
    }

    try {
      const emailPost = await axios.post(`${API_PATH}/emailJobPost`, {
        data: JSON.stringify({ ...state, payment_id: paymentMethod.id }),
      });

      // get jobEmail data and send with payment
      if (emailPost.status === 200) {
        try {
          const { status, data: paymentIntent } = await axios.post(
            `${API_PATH}/payments`,
            {
              expatriant_id: emailPost.data.expatriant_id,
              client_email,
              client_address,
            }
          );

          if (status === 200) {
            const { error } = await stripe.confirmCardPayment(
              paymentIntent.client_secret,
              {
                payment_method: paymentMethod.id,
              }
            );

            if (error) {
              setCardError(error.message);
              setIsProcessing(false);
              return;
            }
            setIsProcessing(false);
            // submitted modal
          }
        } catch (err) {
          setCardError("Unable to process your payment. Try again later.");
          setIsProcessing(false);
        }
      }
    } catch (error) {
      alert("Unable to process request. You won't be charged.");
      setIsProcessing(false);
    }
  };

  const metaDescription =
    "Find qualified Expats in Russia. More than 1000 Expats browse Expatriant Jobs every month.";
  const pageTitle = "Hire Expats in Russia - Expatriant";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
      </Head>

      <Box margin={{ top: "medium" }} pad={{ left: "small", right: "small" }}>
        <Box alignSelf="start" width="fit-content">
          <Link href="/">
            <Anchor>Back to Jobs</Anchor>
          </Link>
        </Box>
        <Box
          fill={true}
          alignSelf="center"
          elevation="medium"
          margin={{ top: "medium" }}
          pad={{ left: "large", right: "large" }}
          round="xsmall"
        >
          <Box
            width="100%"
            alignSelf="center"
            pad={{ bottom: "large" }}
            border={{
              color: "border",
              size: "xsmall",
              style: "solid",
              side: "bottom",
            }}
          >
            <Heading alignSelf="center" textAlign="center" level={1}>
              Hire Expats in Russia
            </Heading>
          </Box>
          <Box
            pad={{ top: "medium", bottom: "medium" }}
            width="large"
            alignSelf="center"
          >
            <Form onSubmit={handleSubmit}>
              <Box direction="column">
                <Box pad={{ bottom: "small" }}>
                  <FormField label="POSITION*">
                    <TextInput
                      required={true}
                      name="position"
                      value={position}
                      placeholder="Your position"
                      onChange={handleChange}
                    />
                  </FormField>
                  <Text size="xsmall">
                    Only <strong>real jobs</strong> are allowed to be posted.
                    Each post should be a single job such as "English Teacher".
                  </Text>
                </Box>
                <Box pad={{ bottom: "small" }}>
                  <FormField label="COMPANY NAME*">
                    <TextInput
                      required={true}
                      name="company"
                      value={company}
                      placeholder="Your company"
                      onChange={handleChange}
                    />
                  </FormField>
                  <Text size="xsmall">Your company's name.</Text>
                </Box>
                <Box pad={{ bottom: "small" }}>
                  <FormField label="COMPANY LOGO">
                    <TextInput
                      name="company_logo"
                      value={company_logo}
                      placeholder="URL to your company's logo"
                      onChange={handleChange}
                    />
                  </FormField>
                  <Text size="xsmall">URL to your company's logo.</Text>
                </Box>
                <Box pad={{ bottom: "small" }}>
                  <JobLocationField
                    location={location}
                    handleObject={handleObject}
                  />
                </Box>
                <Box pad={{ bottom: "small" }}>
                  <FormField label="SALARY">
                    <TextInput
                      name="salary"
                      value={salary}
                      placeholder="Your position's salary info"
                      onChange={handleChange}
                    />
                  </FormField>
                  <Text size="xsmall">
                    Please write salary in US dollars per year.
                  </Text>
                </Box>
                <Box pad={{ bottom: "small" }}>
                  <JobCategoryField
                    handleChange={handleChange}
                    category={category}
                  />
                </Box>
                <Box pad={{ bottom: "small" }}>
                  <JobDescriptionField
                    handleObject={handleObject}
                    html_desc={html_desc}
                  />
                </Box>
                <Box pad={{ bottom: "small" }}>
                  <FormField label="APPLICATION URL*">
                    <TextInput
                      name="application_url"
                      required={true}
                      value={application_url}
                      placeholder="URL to apply to your position"
                      onChange={handleChange}
                    />
                  </FormField>
                  <Text size="xsmall">
                    URL or Email where candidates should apply to this job.
                  </Text>
                </Box>
                <Box pad={{ bottom: "small" }}>
                  <FormField label="YOUR EMAIL*">
                    <TextInput
                      name="client_email"
                      required={true}
                      type="email"
                      value={client_email}
                      placeholder="Your contact email"
                      onChange={handleChange}
                    />
                  </FormField>
                  <Text size="xsmall">
                    Your email will not be published. We will ONLY contact you
                    if we need additional information.
                  </Text>
                </Box>
                <Box pad={{ bottom: "small" }}>
                  <FormField label="COUPON CODE">
                    <TextInput
                      name="coupon_code"
                      required={true}
                      value={coupon_code}
                      placeholder="Enter a coupon code"
                      onChange={handleChange}
                    />
                  </FormField>
                  <Text size="xsmall">
                    Use coupon code <strong>freePost2020</strong> for a free job
                    post!
                  </Text>
                </Box>
                {!freePost && (
                  <>
                    <Box pad={{ bottom: "small" }}>
                      <FormField
                        label="PAYMENT*"
                        error={cardError}
                        component={renderPayment}
                      />
                      <Text size="xsmall">
                        <span role="img" aria-label="Lock emoji">
                          🔒
                        </span>
                        Secure payment powered by Stripe. Your card WILL NOT be
                        charged until you click Post Job.
                      </Text>
                    </Box>

                    <Box pad={{ bottom: "small" }}>
                      <InvoiceAddressField
                        client_address={client_address}
                        handleObject={handleObject}
                      />
                    </Box>
                  </>
                )}
              </Box>
              <Box>
                <Box
                  width="150px"
                  margin={{ top: "medium" }}
                  justify="center"
                  alignSelf="center"
                >
                  <Button
                    primary
                    disabled={isProcessing}
                    type="submit"
                    label={
                      !isProcessing ? (
                        `Post Job $${freePost ? 0 : 49}`
                      ) : (
                        <BeatLoader margin={0} color="white" />
                      )
                    }
                  />
                  {isProcessing && (
                    <Text textAlign="center" size="xsmall">
                      Submitting...
                    </Text>
                  )}
                </Box>
              </Box>
            </Form>
          </Box>
          {(showSuccess && (
            <PopupModal
              status="Success"
              size={size}
              open={showSuccess}
              setOpen={setSuccess}
              title="Your Job Was Submitted"
              body={
                <>
                  You can post another one, or go back to our open jobs. If you
                  have questions, contact us at{" "}
                  <Anchor href="mailto:contact@expatriant.com?subject=Job Posting">
                    contact@expatriant.com
                  </Anchor>
                  .
                </>
              }
              cta="Post Another Job"
              link="/"
              linkText="Back to Jobs"
            />
          )) ||
            (showError && (
              <PopupModal
                size={size}
                open={showError}
                setOpen={setError}
                title="Error 500"
                body={
                  <>
                    Our server is temporarily unavailable. If you have
                    questions, contact us at{" "}
                    <Anchor href="mailto:contact@expatriant.com?subject=Job Posting">
                      contact@expatriant.com
                    </Anchor>
                    .
                  </>
                }
                cta="Try Again"
                link="/"
                linkText="Back to Jobs"
              />
            ))}
        </Box>
      </Box>
    </>
  );
};

const JobForm = ({ size, logEvent }) => {
  return (
    <Elements stripe={stripePromise}>
      <SubmitJobForm size={size} logEvent={logEvent} />
    </Elements>
  );
};

export default JobForm;
