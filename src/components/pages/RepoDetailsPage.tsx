import React, { useEffect, useState } from "react";
import { GitHubService } from "../../api/services/GitHubService";
import RepoDetailsTemplate from "../../components/templates/RepoDetailsTemplate";
import { useParams } from "react-router-dom";
import { RepoDetails } from "../../models/repository/RepoDetails";
import Breadcrumb from "../atoms/Breadcrumb";

const RepoDetailsPage: React.FC = ({}) => {
  const { name, fullName } = useParams<{ name: string; fullName: string }>();
  const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      if (fullName && name) {
        try {
          const data = await GitHubService.getRepoDetails(name, fullName);
          setRepoDetails(data);
        } catch (error) {
          console.error("Error fetching repo details:", error);
        }
      }
    };

    fetchRepoDetails();
  }, [fullName]);

  return (
    <div>
      {repoDetails ? (
        <>
          <Breadcrumb items={[{ label: "Home", path: "/" }]} />
          <RepoDetailsTemplate repoDetails={repoDetails} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RepoDetailsPage;
