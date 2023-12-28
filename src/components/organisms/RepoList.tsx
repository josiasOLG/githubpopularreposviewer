import React, { useState } from "react";
import RepoListItem from "../../components/molecules/RepoListItem";
import { Repository } from "../../models/repository/Repository";
import Button from "../atoms/Button";
import Modal from "../molecules/Modal";
import Toast from "../molecules/Toast";
import localStorageService from "../../api/services/localStorageService";
import Label from "../atoms/Label";

interface RepoListProps {
  repos: Repository[];
}

const RepoList: React.FC<RepoListProps> = ({ repos }) => {
  const [selectedRepos, setSelectedRepos] = useState<Repository[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [message, setMenssage] = useState("");

  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepos((prev: any) => {
      const isAlreadySelected = prev.some((r: any) => r.id === repo.id);
      if (isAlreadySelected) {
        return prev.filter((r: any) => r.id !== repo.id);
      } else {
        return [...prev, repo];
      }
    });
  };

  const handleSave = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    let allSavedSuccessfully = true;
    selectedRepos.forEach((repo) => {
      const isSaved = localStorageService.insert("selectedRepos", repo);
      if (!isSaved) allSavedSuccessfully = false;
    });
    const messager = allSavedSuccessfully
      ? "Repositories saved successfully!"
      : "Some repositories were not saved due to duplication.";
    setMenssage(messager);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 3000); // Hide toast after 3 seconds
  };

  return (
    <div className="divide-y divide-gray-200">
      {repos.map((repo) => (
        <RepoListItem
          key={repo.id}
          name={repo.name}
          description={repo.description}
          stargazers_count={repo.stargazers_count}
          isPrivate={repo.isPrivate}
          owner={repo.owner}
          onSelect={handleSelectRepo}
        />
      ))}
      <Button onClick={handleSave} className="GT-btn__primary">
        Save Selected Repositories
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
      >
        <Label
          className="text-gray"
          text="Are you sure you want to save the selected repositories?"
        />
      </Modal>

      <Toast isVisible={isToastVisible} message={message} />
    </div>
  );
};

export default RepoList;
