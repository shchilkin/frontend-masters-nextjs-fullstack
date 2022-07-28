import { Box, Flex, Text, Image } from "@chakra-ui/react";
import GradientLayout from "../components/GradientLayout";
import prisma from "../lib/prisma";
import { useMe } from "../lib/hooks";

const Home = ({ artists }) => {
  const { user } = useMe();

  return (
    <GradientLayout
      color="green"
      subtitle="profile"
      title={`${user?.firstName} ${user?.lastName}`}
      description={`${user.playlistCount} public playlists`}
      image="https://cdn.dribbble.com/users/5138895/avatars/normal/451a1e7c8e255dcddab3228559055b2b.png?1603969526"
      roundImage
    >
      <Box color="white">
        <Box marginBottom="40px">
          <Text fontSize="xl" fontWeight="bold">
            Top artists of the month
          </Text>
          <Text fontSize="medium">Only visible to you</Text>
        </Box>
        <Flex>
          {artists.map((artist) => (
            <Box paddingX="10px" width="20%">
              <Box bg="gray.800" borderRadius="4px" padding="15px" width="100%">
                <Image
                  src="https://placekitten.com/g/300/300"
                  borderRadius="100%"
                />
                <Box marginTop="20px">
                  <Text fontWeight="bold" fontSize="large">
                    {artist.name}
                  </Text>
                  <Text fontSize="small">Artist</Text>
                </Box>
              </Box>
            </Box>
          ))}
        </Flex>
      </Box>
    </GradientLayout>
  );
};

export const getServerSideProps = async () => {
  const artists = await prisma.artist.findMany({});

  return {
    props: { artists },
  };
};

export default Home;
