import os
import sys
import zipfile
import subprocess

def check_kaggle_json():
    kaggle_dir = os.path.expanduser('~/.kaggle')
    kaggle_file = os.path.join(kaggle_dir, 'kaggle.json')
    if not os.path.exists(kaggle_file):
        print("ERROR: kaggle.json not found!")
        print("Please follow these steps to set up Kaggle API:")
        print("1. Go to https://www.kaggle.com/")
        print("2. Log in and go to your Account settings (click on your profile picture -> Settings)")
        print("3. Scroll down to the 'API' section and click 'Create New Token'")
        print("4. This will download a file named 'kaggle.json'")
        print(f"5. Create the directory: {kaggle_dir}")
        print(f"6. Move the downloaded 'kaggle.json' to {kaggle_file}")
        print("7. Run this script again.")
        sys.exit(1)

def download_dataset():
    dataset_name = "masoudnickparvar/brain-tumor-mri-dataset"
    print(f"Downloading dataset {dataset_name}...")
    
    # We use subprocess to run the kaggle cli because importing kaggle automatically 
    # throws an error if kaggle.json is not present, which we want to handle gracefully above.
    try:
        subprocess.run(['kaggle', 'datasets', 'download', '-d', dataset_name], check=True)
        print("Download complete.")
    except subprocess.CalledProcessError as e:
        print(f"Failed to download dataset. Ensure kaggle is installed and your token is valid. Error: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print("Kaggle CLI not found. Are you running this inside the virtual environment? Run '.\\venv\\Scripts\\Activate.ps1' then 'pip install kaggle'")
        sys.exit(1)

def extract_dataset():
    zip_file = "brain-tumor-mri-dataset.zip"
    if not os.path.exists(zip_file):
        print(f"File {zip_file} not found. Skipping extraction.")
        return

    print(f"Extracting {zip_file}...")
    dataset_dir = "dataset"
    with zipfile.ZipFile(zip_file, 'r') as zip_ref:
        zip_ref.extractall(dataset_dir)
    print(f"Extracted to ./{dataset_dir}/")
    
    # Optional: clean up the zip file to save space
    os.remove(zip_file)
    print("Cleaned up zip file.")

if __name__ == "__main__":
    check_kaggle_json()
    download_dataset()
    extract_dataset()
    print("Dataset collection successful! Data is available in the 'dataset' directory.")
