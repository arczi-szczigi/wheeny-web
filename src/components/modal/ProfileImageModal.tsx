import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #202020;
  margin: 0 0 16px 0;
  text-align: center;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin: 0 0 24px 0;
  line-height: 1.5;
`;

const UploadArea = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? '#ffd100' : '#ddd'};
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.isDragOver ? '#fffbf0' : '#fafafa'};
  margin-bottom: 24px;

  &:hover {
    border-color: #ffd100;
    background: #fffbf0;
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: #ccc;
  margin-bottom: 16px;
`;

const UploadText = styled.div`
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
`;

const UploadSubtext = styled.div`
  font-size: 14px;
  color: #999;
`;

const FileInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ffd100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary ? `
    background: #ffd100;
    color: #202020;
    
    &:hover {
      background: #e6bc00;
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  ` : `
    background: #f5f5f5;
    color: #666;
    
    &:hover {
      background: #e5e5e5;
    }
  `}
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 14px;
  text-align: center;
  margin-bottom: 16px;
`;

interface ProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    // Sprawdź typ pliku
    if (!file.type.startsWith('image/')) {
      setError('Proszę wybrać plik obrazu (JPEG, PNG, GIF)');
      return;
    }

    // Sprawdź rozmiar pliku (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Plik jest za duży. Maksymalny rozmiar to 5MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Utwórz preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      await onUpload(selectedFile);
      onClose();
    } catch (err) {
      setError('Wystąpił błąd podczas uploadu. Spróbuj ponownie.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setIsDragOver(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>Dodaj swoją miniaturkę</Title>
        <Description>
          Wybierz zdjęcie profilowe. Po dodaniu aplikacja automatycznie przycięje je do kształtu koła.
        </Description>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {!selectedFile ? (
          <UploadArea
            isDragOver={isDragOver}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <UploadIcon>📷</UploadIcon>
            <UploadText>Kliknij aby wybrać plik lub przeciągnij tutaj</UploadText>
            <UploadSubtext>Obsługiwane formaty: JPEG, PNG, GIF (max 5MB)</UploadSubtext>
          </UploadArea>
        ) : (
          <PreviewContainer>
            <ImagePreview>
              <PreviewImage src={previewUrl!} alt="Podgląd" />
            </ImagePreview>
            <UploadText>Podgląd - zdjęcie zostanie przycięte do koła</UploadText>
          </PreviewContainer>
        )}

        <FileInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
        />

        <ButtonContainer>
          <Button onClick={handleClose}>
            Anuluj
          </Button>
          {selectedFile && (
            <Button
              primary
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Uploadowanie...' : 'Zapisz miniaturkę'}
            </Button>
          )}
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

