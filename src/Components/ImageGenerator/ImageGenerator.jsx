import React, { useRef, useState } from "react";
import './ImageGenerator.css'
import default_image from '../Assets/default_image.svg';  // Default image to show when no image is generated

const ImageGenerator = () => { 
    const [image_url, setImage_url] = useState("/"); // Default to the default image
    const [loading, setLoading] = useState(false);
    let inputRef = useRef(null);

    // Get the API key from the environment variable
    const apiKey = process.env.REACT_APP_HUGGINGFACE_API_KEY;  // Make sure this is set in your .env file

    const generateImage = async () => {
        const prompt = inputRef.current.value;

        if (!prompt) {
            console.error("Input is empty, please provide a prompt.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v-1-4-original', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,  // Use your Hugging Face API key here
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: prompt, // Text prompt for generating the image
                }),
            });

            const responseData = await response.json();  // Wait for the full response

            // Log the entire response to help debug
            console.log('Response:', responseData);

            if (response.ok) {
                // Check the actual response structure (it may vary)
                if (responseData && responseData.data && responseData.data[0]) {
                    setImage_url(responseData.data[0].url);  // Set the image URL from the response
                } else {
                    console.error("No image returned from the API.");
                }
            } else {
                console.error("Failed to generate image. Status:", response.status);
                console.error("Error details:", responseData);  // Log error details to see the exact issue
            }
        } catch (error) {
            console.error("Error generating image:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="ai-image-generator">
                <div className="header">AI Image <span>Generator</span></div>
                <div className="img-loading">
                    <div className="image">
                        <img src={image_url === '/' ? default_image : image_url} alt="Generated" />
                    </div>
                    <div className="loading">
                        <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
                        <div className={loading ? "loading-text" : "display-none"}>Generating...</div>
                    </div>
                </div>
                <div className="search-box">
                    <input type="text" ref={inputRef} className="search-input" placeholder="Let your thoughts flow" />
                    <div className="generate-btn" onClick={generateImage}>Generate</div>
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
