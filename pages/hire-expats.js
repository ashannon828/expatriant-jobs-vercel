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
import { v4 as uuidv4 } from "uuid";
import Head from "next/head";
import BeatLoader from "react-spinners/BeatLoader";

import PopupModal from "../components/Modal";

import JobSalaryField from "../components/JobFormComponents/JobSalaryField";
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

// const API_PATH = process.env.NEXT_PUBLIC_API;
const API_PATH = "http://localhost:5000/agent1-prjniw/europe-west1/api";
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
    active: false,
    expatriant_id: uuidv4(),
    payment_id: "",
    position: "",
    company: "",
    company_logo: "",
    location: "",
    latLng: {},
    currency: "",
    amount: "",
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
  const [isProcessing, setProcessingTo] = useState(false);
  //success modal
  const [showSuccess, setSuccess] = useState(false);
  //error modal
  const [showError, setError] = useState(false);
  const [cardError, setCardError] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const {
    expatriant_id,
    position,
    company,
    company_logo,
    location,
    currency,
    amount,
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
    // Stripe.js has not loaded yet. Make sure to disable
    // form submission until Stripe.js has loaded.
    if (!stripe || !elements) {
      return;
    }

    const salary = currency ? { currency: currency, amount: amount } : {};

    // free post logic
    if (freePost) {
      setProcessingTo(true);
      try {
        const emailPost = await axios.post(`${API_PATH}/emailJobPost`, {
          data: JSON.stringify({
            ...state,
            salary,
            payment_id: "freePost2020",
          }),
        });
        if (emailPost.status === 200) {
          setProcessingTo(false);
          handleObject({ ...initialState });
          // submitted modal
          setSuccess(true);
          logEvent("post-job", "success", `${company}-${position}`);
        }
      } catch (err) {
        setError(true);
        setProcessingTo(false);
        logEvent("post-job", "failed", `${company}-${position}`);
      }
      return;
    }
    setProcessingTo(true);

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment intent and generate client secret
      const { data: clientSecret } = await axios.post(
        `${API_PATH}/payment-intent`,
        {
          expatriant_id,
          client_address,
          job: JSON.stringify({ ...state }),
        }
      );

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          email: client_email,
        },
      });

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq.paymentMethod.id,
      });

      if (error) {
        setProcessingTo(false);
        setPaymentError(error.message);
        setError(true);
        return;
      }

      setProcessingTo(false);
      handleObject({ ...initialState });
      // submitted modal
      setSuccess(true);
      logEvent("post-job", "success", `${company}-${position}`);
    } catch (error) {
      console.error(error);
      setProcessingTo(false);
      setPaymentError(
        <>
          You weren't charged. If you have questions, contact us at{" "}
          <Anchor href="mailto:contact@expatriant.com?subject=Job Post Error">
            contact@expatriant.com
          </Anchor>
          .
        </>
      );
      setError(true);
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

      <Box
        width="xlarge"
        margin={{ top: "medium" }}
        pad={{ left: "small", right: "small" }}
      >
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
            alignSelf="center"
            width="large"
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
            width="large"
            pad={{ top: "medium", bottom: "medium" }}
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
                    Each post should be a single vacancy such as "English
                    Teacher".
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
                  <FormField label="MONTHLY SALARY">
                    <JobSalaryField
                      currency={currency}
                      amount={amount}
                      handleChange={handleChange}
                    />
                  </FormField>
                  <Text size="xsmall">
                    Choose the currency and enter the salary for this position.
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
                    URL or Email where candidates can apply to this vacancy.
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
                  You can post another one or go back to our open jobs. If you
                  have questions, you can contact us at{" "}
                  <Anchor href="mailto:contact@expatriant.com?subject=Job Post Success">
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
                title="Your Transaction Failed"
                body={paymentError}
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
